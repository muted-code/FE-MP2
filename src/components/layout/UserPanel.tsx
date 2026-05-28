import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const UserPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-full transition-colors focus:outline-none"
      >
        <div className="relative">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
            alt="User avatar" 
            className="w-10 h-10 rounded-full border-2 border-primary object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#121212] rounded-full"></div>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
          <p className="text-xs text-muted leading-tight">En línea</p>
        </div>
        <ChevronDown size={16} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-muted truncate">@{user.username}</p>
          </div>
          
          <div className="p-2 space-y-1">
            <Link 
              to="/profile" 
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <UserIcon size={16} className="text-primary" />
              Mi Perfil
            </Link>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings size={16} className="text-primary" />
              Configuración
            </button>
          </div>

          <div className="p-2 border-t border-white/10">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
