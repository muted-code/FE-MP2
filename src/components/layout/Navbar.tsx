import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import UserPanel from './UserPanel';

const Navbar: React.FC = () => {
  const { user, firebaseUser } = useAuth();

  return (
    <nav 
      role="navigation" 
      aria-label="Navegación principal" 
      className="glass-panel text-text p-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/10"
    >
      <div className="flex items-center gap-6">
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-md">Study Room</Link>
        {user && (
          <div className="hidden md:flex gap-4">
            <Link to="/dashboard" className="hover:text-primary transition-colors font-medium">Dashboard</Link>
          </div>
        )}
      </div>
      
      <div>
        {firebaseUser && (
          <div className="flex items-center gap-4">
            {!user && <span className="text-muted text-sm">Configurando perfil...</span>}
            <UserPanel />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
