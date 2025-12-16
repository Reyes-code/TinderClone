import React, { useState, useEffect } from 'react';
import Nav from "../components/Nav";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function OnBoarding() {
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(null);
  
  const [formData, setFormData] = useState({
    user_id: '',
    first_name: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    show_gender: false,
    gender_identity: 'man',
    gender_interest: 'woman',
    email: '',
    password: '', // Añadido campo password
    url: '',
    about: '',
    matches: []
  });

  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  // DEBUG: Ver qué hay en las cookies
  useEffect(() => {
    console.log("🍪 Cookies actuales:", cookies);
    console.log("📝 FormData:", formData);
  }, [cookies, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("🚀 Enviando formulario...");
    console.log("📧 Email:", formData.email);
    console.log("🔑 Password:", formData.password);
    console.log("👤 User ID en formData:", formData.user_id);

    try {
      // 1. PRIMERO: Intentar SIGNUP
      console.log("📤 Intentando signup...");
      const signupResponse = await axios.post('http://localhost:8000/signup', {
        email: formData.email,
        password: formData.password || "default123" // Usar password del form
      }).catch(signupErr => {
        console.log("⚠️ Error en signup:", signupErr.response?.data);
        throw signupErr;
      });
      
      console.log("✅ Signup exitoso:", signupResponse.data);
      
      // Guardar cookies
      setCookie('UserId', signupResponse.data.userId);
      setCookie('AuthToken', signupResponse.data.token);
      setCookie('Email', signupResponse.data.email);
      
      // Actualizar formData con el user_id real
      const updatedFormData = {
        ...formData,
        user_id: signupResponse.data.userId
      };
      
      console.log("🔄 FormData actualizado con userId:", updatedFormData.user_id);
      
      // 2. LUEGO: Actualizar perfil
      console.log("📤 Enviando datos de perfil...");
      const profileResponse = await axios.put('http://localhost:8000/user', { 
        formData: updatedFormData
      }).catch(profileErr => {
        console.log("⚠️ Error actualizando perfil:", profileErr.response?.data);
        throw profileErr;
      });
      
      console.log("✅ Perfil actualizado:", profileResponse.data);
      
      if (profileResponse.status === 200) {
        console.log("🎉 Navegando a dashboard...");
        navigate('/dashboard');
      }
      
    } catch (err) {
      console.log("❌ Error completo:", err);
      
      // Si es error 409 (usuario ya existe), intentar LOGIN
      if (err.response?.status === 409) {
        console.log("🔄 Usuario ya existe, intentando login...");
        try {
          const loginResponse = await axios.post('http://localhost:8000/login', {
            email: formData.email,
            password: formData.password || "default123"
          });
          
          console.log("✅ Login exitoso:", loginResponse.data);
          
          setCookie('UserId', loginResponse.data.userId);
          setCookie('AuthToken', loginResponse.data.token);
          setCookie('Email', loginResponse.data.email);
          
          // Actualizar y enviar perfil
          const updatedFormData = {
            ...formData,
            user_id: loginResponse.data.userId
          };
          
          const profileResponse = await axios.put('http://localhost:8000/user', { 
            formData: updatedFormData
          });
          
          if (profileResponse.status === 200) {
            navigate('/dashboard');
          }
          
        } catch (loginErr) {
          console.log("❌ Error en login:", loginErr.response?.data);
          alert(`Error al iniciar sesión: ${loginErr.response?.data || 'Credenciales incorrectas'}`);
        }
      } else {
        alert(`Error: ${err.response?.data || 'Error desconocido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    
    console.log(`✏️ Cambiando ${name} a:`, value);
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />
      <div className="onboarding">
        <h2>CREATE ACCOUNT</h2>
        
        {loading && <div className="loading">Cargando...</div>}

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN EMAIL Y PASSWORD */}
          <section>
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              required={true}
              value={formData.email}
              onChange={handleChange}
            />
            
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required={true}
              value={formData.password}
              onChange={handleChange}
              minLength="6"
            />
            
            <p style={{ fontSize: '12px', color: '#666' }}>
              * Required for account creation
            </p>
          </section>

          <section>
            <label htmlFor="first_name">First Name *</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="First Name"
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />

            <label>Birthday *</label>
            <div className="multiple-input-container">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                placeholder="DD"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
                min="1"
                max="31"
              />
              <input
                id="dob_month"
                type="number"
                name="dob_month"
                placeholder="MM"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
                min="1"
                max="12"
              />
              <input
                id="dob_year"
                type="number"
                name="dob_year"
                placeholder="YYYY"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
                min="1900"
                max="2023"
              />
            </div>

            <label>Gender *</label>
            <div className="multiple-input-container">
              <input
                id="man-gender-identity"
                type="radio"
                name="gender_identity"
                value="man"
                onChange={handleChange}
                checked={formData.gender_identity === "man"}
              />
              <label htmlFor="man-gender-identity">Man</label>

              <input
                id="woman-gender-identity"
                type="radio"
                name="gender_identity"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_identity === "woman"}
              />
              <label htmlFor="woman-gender-identity">Woman</label>

              <input
                id="more-gender-identity"
                type="radio"
                name="gender_identity"
                value="more"
                onChange={handleChange}
                checked={formData.gender_identity === "more"}
              />
              <label htmlFor="more-gender-identity">More</label>
            </div>

            <label htmlFor="show-gender">Show Gender on my profile</label>
            <input
              id="show-gender"
              type="checkbox"
              name="show_gender"
              onChange={handleChange}
              checked={formData.show_gender}
            />

            <label>Show Me *</label>
            <div className="multiple-input-container">
              <input
                id="man-gender-interest"
                type="radio"
                name="gender_interest"
                value="man"
                onChange={handleChange}
                checked={formData.gender_interest === "man"}
              />
              <label htmlFor="man-gender-interest">Man</label>

              <input
                id="woman-gender-interest"
                type="radio"
                name="gender_interest"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_interest === "woman"}
              />
              <label htmlFor="woman-gender-interest">Woman</label>

              <input
                id="everyone-gender-interest"
                type="radio"
                name="gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={formData.gender_interest === "everyone"}
              />
              <label htmlFor="everyone-gender-interest">Everyone</label>
            </div>

            <label htmlFor="about">About Me</label>
            <input
              id="about"
              type="text"
              name="about"
              placeholder="I like cats"
              value={formData.about}
              onChange={handleChange}
            />
            
            <label htmlFor="url">Profile Photo URL</label>
            <input
              type="url"
              name="url"
              id="url"
              placeholder="https://example.com/your-photo.jpg"
              value={formData.url}
              onChange={handleChange}
            />
            
            <div className="photo-container">
              {formData.url && <img src={formData.url} alt="profile pic preview"/>}
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </section>
        </form>
      </div>
    </>
  );
}

export default OnBoarding;