import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import AuthModal from "../components/AuthModal";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies] = useCookies(['AuthToken']);
  const navigate = useNavigate();

  // Verificar si ya está autenticado
  useEffect(() => {
    if (cookies.AuthToken) {
      console.log("✅ Usuario ya autenticado, redirigiendo a dashboard...");
      navigate('/dashboard');
    }
  }, [cookies.AuthToken, navigate]);

  const authToken = cookies.AuthToken || false;

  const handleClick = () => {
    if (authToken) {
      // Logout
      document.cookie = "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "Email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload(); // Recargar para actualizar estado
    } else {
      // Mostrar modal de login/registro
      setShowModal(true);
      setIsSignUp(true);
    }
  };

  // Función para manejar login exitoso
  const handleSuccessfulAuth = () => {
    console.log("✅ Autenticación exitosa, cerrando modal...");
    setShowModal(false);
    // La redirección se manejará en el useEffect cuando se actualicen las cookies
  };

  return (
    <div className="overlay">
      <Nav
        minimal={false}
        authToken={authToken}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <h1 className="primary-title">Swipe Right</h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Sign out" : "Create Account"}
        </button>

        {showModal && (
          <AuthModal 
            setShowModal={setShowModal} 
            setIsSignUp={setIsSignUp} 
            isSignUp={isSignUp}
            onSuccess={handleSuccessfulAuth} // <-- Pasar callback
          />
        )}
      </div>
    </div>
  );
};

export default Home;