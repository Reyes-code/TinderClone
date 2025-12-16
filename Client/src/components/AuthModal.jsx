import React, { useState } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';

const AuthModal = ({ setShowModal, isSignUp, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("📤 Enviando formulario de autenticación...");

    // Validaciones
    if (isSignUp && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp ? "signup" : "login";
      console.log(`🔐 Intentando ${endpoint} para: ${email}`);

      const response = await axios.post(`http://localhost:8000/${endpoint}`, {
        email,
        password,
      });

      console.log("✅ Respuesta del servidor:", response.data);

      // Guardar cookies
      if (response.data.token && response.data.userId) {
        setCookie("AuthToken", response.data.token);
        setCookie("UserId", response.data.userId);
        setCookie("Email", email);
        
        console.log("🍪 Cookies guardadas:");
        console.log("  AuthToken:", response.data.token.substring(0, 20) + "...");
        console.log("  UserId:", response.data.userId);
        console.log("  Email:", email);

        // Llamar al callback de éxito
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirigir manualmente si no hay callback
          setShowModal(false);
          // Recargar o redirigir
          window.location.href = "/dashboard";
        }
      } else {
        setError("Error: No se recibieron datos de autenticación");
      }
    } catch (error) {
      console.error("❌ Error en autenticación:", error);
      
      if (error.response) {
        setError(error.response.data || "Error del servidor");
      } else if (error.request) {
        setError("No se pudo conectar al servidor");
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={() => setShowModal(false)}>
        ✖
      </div>
      <h2>{isSignUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <button className="secondary-button" type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignUp ? "Create Account" : "Log In"}
        </button>
      </form>
      <hr />
      <h2>GET THE APP</h2>
    </div>
  );
};

export default AuthModal;