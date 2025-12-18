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

  // Datos estáticos de respaldo
  /* const staticCharacters = [
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
  ]; */

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
  const swiped = (direction, userId) => {
    console.log(`Swipe ${direction} para usuario: ${userId}`);
    setLastDirection(direction);
    
    if (direction === 'right') {
      // LIKE - Añadir a matches
      handleLike(userId);
    } else if (direction === 'left') {
      // DISLIKE
      handleDislike(userId);
    }
  };

  const handleLike = async (likedUserId) => {
    try {
      console.log(`❤️ Like a usuario: ${likedUserId}`);
      
      // Aquí deberías enviar el like al backend
      // await axios.post('http://localhost:8000/like', {
      //   userId: cookies.UserId,
      //   likedUserId: likedUserId
      // });
      
    } catch (err) {
      console.error("Error al registrar like:", err);
    }
  };

  const handleDislike = async (dislikedUserId) => {
    console.log(`👎 Dislike a usuario: ${dislikedUserId}`);
    // Similar a handleLike
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
 {/*          {genderedUsers.length > 0 ? (
            genderedUsers.map((character) => (
              <TinderCard 
                className='swipe' 
                key={character.user_id} 
                onSwipe={(dir) => swiped(dir, character.user_id)} 
                onCardLeftScreen={() => outOfFrame(character.first_name)}
                preventSwipe={['up', 'down']}
              >
                <div 
                  style={{ backgroundImage: `url(${character.url || '/default-avatar.png'})` }} 
                  className='card'
                >
                  <div className="card-overlay">
                    <h3>{character.first_name || 'Usuario'}</h3>
                    {character.about && <p>{character.about}</p>}
                    {character.dob_year && (
                      <p>Edad: {new Date().getFullYear() - parseInt(character.dob_year)}</p>
                    )}
                  </div>
                </div>
              </TinderCard>
            ))
          ) : (
            // Si no hay usuarios, mostrar mensaje */}
            <div className="no-users-message">
              <h3>No hay más usuarios para mostrar</h3>
              <p>Intenta cambiar tus preferencias de búsqueda</p>
            </div>
          )}

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