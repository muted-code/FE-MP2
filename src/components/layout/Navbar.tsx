import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, firebaseUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-4 z-50 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        role="navigation" 
        aria-label="Navegación principal" 
        className="flex items-center justify-between border border-white/10 dark:border-slate-700 px-6 py-3 rounded-full text-text text-sm backdrop-blur-md bg-surface/80 shadow-lg"
      >
        <div className="flex items-center gap-6">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-90 transition-transform duration-500">
                <circle cx="4.706" cy="16" r="4.706" className="fill-primary" />
                <circle cx="16.001" cy="4.706" r="4.706" className="fill-secondary" />
                <circle cx="16.001" cy="27.294" r="4.706" className="fill-secondary" />
                <circle cx="27.294" cy="16" r="4.706" className="fill-primary" />
            </svg>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden sm:block">
              Study Room
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-6 ml-4">
              <Link to="/dashboard" className="relative overflow-hidden h-5 group">
                <span className="block group-hover:-translate-y-full transition-transform duration-300 font-medium">Dashboard</span>
                <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300 font-medium text-primary">Dashboard</span>
              </Link>
              <Link to="/profile" className="relative overflow-hidden h-5 group">
                <span className="block group-hover:-translate-y-full transition-transform duration-300 font-medium">Perfil</span>
                <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300 font-medium text-primary">Perfil</span>
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Switch */}
          <label className="relative hidden sm:inline-flex cursor-pointer items-center gap-2 text-text" title="Alternar tema">
              <input type="checkbox" className="peer sr-only" checked={theme === 'dark'} onChange={toggleTheme} />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 dark:bg-slate-700 ring-offset-1 transition-colors duration-200 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50"></div>
              <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
          </label>

          {firebaseUser ? (
            <div className="hidden md:flex items-center gap-4 ml-2">
              {user ? (
                 <div className="flex items-center gap-2">
                   {user.avatarUrl ? (
                     <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-primary/50" />
                   ) : (
                     <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                       {user.name.charAt(0).toUpperCase()}
                     </div>
                   )}
                 </div>
              ) : (
                 <span className="text-xs text-muted animate-pulse">Configurando...</span>
              )}
              <button 
                onClick={logout}
                className="border border-white/10 hover:bg-red-500/10 text-text hover:text-red-500 hover:border-red-500/30 px-4 py-1.5 rounded-full text-sm font-medium transition duration-300"
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="border border-white/10 hover:bg-surface px-4 py-1.5 rounded-full text-sm font-medium transition duration-300">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-primary hover:shadow-[0px_0px_20px_5px] hover:shadow-primary/40 text-white px-4 py-1.5 rounded-full text-sm font-medium transition duration-300">
                Registrarse
              </Link>
            </div>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-text p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-4 right-4 bg-surface border border-white/10 rounded-2xl shadow-xl p-4 flex flex-col gap-4 md:hidden backdrop-blur-xl"
        >
          {user && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary font-medium p-2">Dashboard</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary font-medium p-2">Perfil</Link>
            </>
          )}
          
          <div className="flex items-center justify-between p-2 border-t border-white/10 mt-2 pt-4">
            <span className="font-medium">Tema Oscuro</span>
            <label className="relative inline-flex cursor-pointer items-center gap-2 text-text">
                <input type="checkbox" className="peer sr-only" checked={theme === 'dark'} onChange={toggleTheme} />
                <div className="peer h-6 w-11 rounded-full bg-slate-300 dark:bg-slate-700 ring-offset-1 transition-colors duration-200 peer-checked:bg-primary"></div>
                <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
            </label>
          </div>

          {firebaseUser ? (
            <button 
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="mt-2 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-medium text-center"
            >
              Cerrar Sesión
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="border border-white/10 text-center px-4 py-2 rounded-xl font-medium">
                Iniciar Sesión
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-white text-center px-4 py-2 rounded-xl font-medium">
                Registrarse
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
