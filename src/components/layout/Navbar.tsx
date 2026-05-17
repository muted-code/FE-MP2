import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, firebaseUser, logout } = useAuth();

  return (
    <nav 
      role="navigation" 
      aria-label="Navegación principal" 
      className="bg-surface text-text p-4 flex justify-between items-center shadow-md"
    >
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-primary">Study Room</Link>
        {user && (
          <>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/profile" className="hover:text-primary transition-colors">Perfil</Link>
          </>
        )}
      </div>
      
      <div>
        {firebaseUser ? (
          <div className="flex items-center gap-4">
            {user ? <span>Hola, {user.name}</span> : <span>Configurando perfil...</span>}
            <button 
              onClick={logout}
              className="bg-red-500/10 text-red-500 px-3 py-1 rounded hover:bg-red-500/20 transition-colors"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-primary transition-colors">Iniciar Sesión</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
