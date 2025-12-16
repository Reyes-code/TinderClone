import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatHeader({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar cookies manualmente
    document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "Email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Navegar al inicio
    navigate('/');
  };

  return (
    <div className='chat-container-header'>
      <div className='profile'>
        <div className='img-container'>
          <img 
            src={user?.url || '/default-avatar.png'} 
            alt={user?.first_name || 'Usuario'}
            onError={(e) => {
              // Si la imagen falla, mostrar una por defecto
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        <div>
          <h3>{user?.first_name || 'Usuario'}</h3>
          {user?.email && (
            <p style={{ fontSize: '12px', margin: '2px 0 0 0', opacity: 0.8 }}>
              {user.email}
            </p>
          )}
        </div>
      </div>
      <i 
        className='log-out-icon' 
        onClick={handleLogout}
        style={{ 
          cursor: 'pointer',
          fontSize: '24px',
          padding: '8px'
        }}
        title="Cerrar sesión"
      >
        🚪
      </i>
    </div>
  );
}

export default ChatHeader;