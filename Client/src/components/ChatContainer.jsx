import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatHeader from './ChatHeader';
import MatchesDisplay from './MatchesDisplay'; // Asegúrate de importar
import ChatDisplay from './ChatDisplay'; // Asegúrate de importar

function ChatContainer() {
  const [cookies] = useCookies(['UserId', 'AuthToken']);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🍪 Cookies actuales:", cookies);
    
    // Verificar autenticación
    if (!cookies.UserId || !cookies.AuthToken) {
      console.log("❌ No autenticado, redirigiendo...");
      navigate('/');
      return;
    }

    // Obtener datos del usuario
    const fetchUserData = async () => {
      try {
        console.log(`📡 Obteniendo datos para user: ${cookies.UserId}`);
        
        const response = await axios.get(`http://localhost:8000/user/${cookies.UserId}`);
        
        console.log("✅ Respuesta del servidor:", response.data);
        
        if (response.data.success) {
          setUser(response.data.user);
          console.log("👤 Datos del usuario:", response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('❌ Error obteniendo datos del usuario:', error);
        console.error('Detalles:', error.response?.data);
        setError('No se pudieron cargar los datos del usuario');
        
        // Si es error 404, el usuario no existe
        if (error.response?.status === 404) {
          console.log("⚠️ Usuario no encontrado en BD");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [cookies, navigate]);

  if (loading) {
    return (
      <div className="chat-loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Cargando datos del usuario...
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-error" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h3>Error: {error}</h3>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
        <button onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader user={user} />
      <button className='option'>matches</button>
      <button className='option'>chat</button>
      <MatchesDisplay user={user} />
      <ChatDisplay user={user} />
    </div>
  );
}

export default ChatContainer;