import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios';

function Dashboard() {
  const [cookies] = useCookies(['UserId', 'AuthToken']);
  const [lastDirection, setLastDirection] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 📌 DATOS ESTÁTICOS DE RESPUESTO (AHORA ACTIVADOS)
  const staticCharacters = [
    {
      name: 'Richard Hendricks',
      url: 'https://i.imgur.com/oPj4A8u.jpg'
    },
    {
      name: 'Erlich Bachman',
      url: 'https://i.imgur.com/oPj4A8u.jpg'
    },
    {
      name: 'Monica Hall',
      url: 'https://i.imgur.com/oPj4A8u.jpg'
    }
  ];

  // 1. VERIFICAR AUTENTICACIÓN
  useEffect(() => {
    console.log("🔍 Verificando autenticación...");
    
    if (!cookies.UserId || !cookies.AuthToken) {
      console.log("❌ No autenticado, redirigiendo a home...");
      navigate('/');
      return;
    }

    // Obtener datos del usuario actual
    const fetchUserData = async () => {
      try {
        console.log("📡 Obteniendo datos del usuario...");
        const userResponse = await axios.get(`http://localhost:8000/user/${cookies.UserId}`);
        
        if (userResponse.data.success) {
          setUser(userResponse.data.user);
          console.log("✅ Usuario cargado:", userResponse.data.user.email);
          
        } else {
          setError("No se pudieron cargar los datos del usuario");
        }
      } catch (err) {
        console.error("❌ Error obteniendo usuario:", err);
        setError("Error al cargar datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [cookies, navigate]);

  // 3. MANEJAR SWIPE (like/dislike)
  const swiped = (direction, characterName) => {
    console.log(`Swipe ${direction} para: ${characterName}`);
    setLastDirection(direction);
    
    if (direction === 'right') {
      console.log(`❤️ Like a: ${characterName}`);
    } else if (direction === 'left') {
      console.log(`👎 Dislike a: ${characterName}`);
    }
  };

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
  };

  // 4. MANEJAR LOGOUT
  const handleLogout = () => {
    // Limpiar cookies
    document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "Email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Redirigir a home
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Cargando Dashboard...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error: {error}</h2>
        <button onClick={() => window.location.reload()}>Reintentar</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Chat Container con datos del usuario */}
      <ChatContainer user={user} />
      
      {/* Swipe Cards */}
      <div className="swipe-container">
        <div className="card-container">
          {/* 📌 USAR DATOS ESTÁTICOS DIRECTAMENTE */}
          {staticCharacters.map((character) => (
            <TinderCard 
              className='swipe' 
              key={character.name} 
              onSwipe={(dir) => swiped(dir, character.name)} 
              onCardLeftScreen={() => outOfFrame(character.name)}
              preventSwipe={['up', 'down']}
            >
              <div 
                style={{ backgroundImage: `url(${character.url})` }} 
                className='card'
              >
                <div className="card-overlay">
                  <h3>{character.name}</h3>
                  {/* Puedes agregar más información estática aquí si quieres */}
                  <p>Personaje de ejemplo</p>
                </div>
              </div>
            </TinderCard>
          ))}

          <div className='swipe-info'>
            {lastDirection ? (
              <p>You Swiped {lastDirection}</p>
            ) : (
              <p>Desliza a la derecha para Like ❤️ o izquierda para Dislike 👎</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;