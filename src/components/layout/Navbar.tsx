import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import UserPanel from './UserPanel';
import { Palette, Check } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, firebaseUser } = useAuth();
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    if (user?.uid) {
      const saved = localStorage.getItem(`studyroom-theme-${user.uid}`) || localStorage.getItem('studyroom-theme') || 'dark';
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, [user?.uid]);

  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (user?.uid) {
      localStorage.setItem(`studyroom-theme-${user.uid}`, theme);
    }
    localStorage.setItem('studyroom-theme', theme); // Fallback
    setShowThemeMenu(false);
  };

  const THEMES = [
    { id: 'dark', name: 'Oscuro', bg: 'bg-[#090a0f]' },
    { id: 'light', name: 'Claro', bg: 'bg-[#f3f4f6]' },
    { id: 'beige', name: 'Latte', bg: 'bg-[#e6d5c3]' },
    { id: 'red-fade', name: 'Rojo Fade', bg: 'bg-gradient-to-br from-red-500 to-red-900' },
    { id: 'blue', name: 'Azul Profundo', bg: 'bg-gradient-to-br from-blue-400 to-blue-900' },
    { id: 'brown', name: 'Café', bg: 'bg-gradient-to-br from-orange-300 to-orange-900' },
  ];

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
        {firebaseUser && !isProfilePage && (
          <div className="flex items-center gap-4">
            {!user && <span className="text-muted text-sm">Configurando perfil...</span>}
            
            {/* Theme Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                title="Cambiar tema"
              >
                <Palette size={20} />
              </button>
              
              {showThemeMenu && (
                <div className="absolute top-full right-0 mt-2 p-4 w-72 bg-dash-panel border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-xs font-bold text-muted/70 uppercase tracking-wider border-b border-white/[0.04] mb-4 pb-2 flex justify-between items-center">
                    <span>Temas</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {THEMES.map((theme) => (
                      <button 
                        key={theme.id}
                        onClick={() => changeTheme(theme.id)}
                        className={`relative w-full aspect-square rounded-xl overflow-hidden shadow-sm transition-all hover:scale-110 hover:shadow-md ${
                          currentTheme === theme.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-dash-panel' : 'border border-white/10'
                        }`}
                        title={theme.name}
                      >
                        <div className={`absolute inset-0 ${theme.bg}`} />
                        {currentTheme === theme.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <Check size={18} className="text-white drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <UserPanel />
          </div>
        )}
        {firebaseUser && isProfilePage && (
          <Link 
            to="/dashboard" 
            className="text-sm text-muted hover:text-primary transition-colors font-medium"
          >
            ← Volver al Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

