 import React, { useState, useRef } from 'react';
import { User, Settings, AlertTriangle, Check, Loader2, LogOut, Camera, Image as ImageIcon } from 'lucide-react';

export const ProfilePage = () => {
  // Estados para manejar el formulario y la UI
  const [formData, setFormData] = useState({
    fullName: 'SAMUEL ESTEBAN GRAJALES RUGELES',
    username: 'samu1000_',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Nuevo estado y ref para el avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulación de re-validación de username
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setFormData({ ...formData, username: newUsername });
    
    if (newUsername !== 'samu1000_') {
      setIsValidating(true);
      setUsernameAvailable(null);
      setTimeout(() => {
        setIsValidating(false);
        setUsernameAvailable(newUsername.length > 4); 
      }, 1000);
    } else {
      setUsernameAvailable(true);
    }
  };

  // Manejador para la subida de la imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Creamos una URL temporal para la vista previa
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const triggerFileInput = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen w-full text-slate-200 p-8 flex justify-center items-start">
      
      {/* Contenedor Principal con mejor sombra y borde */}
      <div className="w-full max-w-3xl bg-[#111827] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header / Banner Superior (Estilo Discord) */}
        <div className="h-32 bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-purple-900/40 relative">
          {/* Botón de edición posicionado sobre el banner */}
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-black/60 transition-colors text-sm font-medium text-white"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
            </button>
          </div>
        </div>

        {/* Sección de Información (Contenido de la tarjeta) */}
        <div className="px-8 pb-8 relative">
          
          {/* Avatar Superpuesto */}
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div 
              className={`relative w-32 h-32 rounded-full border-4 border-[#111827] bg-[#1f2937] flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden ${isEditing ? 'cursor-pointer group' : ''}`}
              onClick={triggerFileInput}
            >
              {/* Imagen o Iniciales */}
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="bg-gradient-to-tr from-cyan-500 to-purple-500 w-full h-full flex items-center justify-center">
                  SR
                </span>
              )}

              {/* Overlay interactivo (Solo visible en modo edición) */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-xs text-white font-medium uppercase tracking-wider">Cambiar</span>
                </div>
              )}
              
              {/* Input de archivo oculto */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/webp"
                className="hidden" 
              />
            </div>
            
            {/* Título simple al lado del avatar */}
            <div className="pb-4">
              <h2 className="text-3xl font-bold text-white">{formData.username}</h2>
              <p className="text-slate-400 text-sm">Gestiona tu identidad en Study Room</p>
            </div>
          </div>

          {/* Formulario de Datos */}
          <div className="bg-[#161f30] rounded-xl border border-slate-800 p-6 space-y-6">
            
            {/* Campo: Nombre Completo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-300">
                  Nombre Completo
                </label>
                <p className="text-xs text-slate-500 mt-1">Cómo te ven los demás usuarios.</p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-[#0f1522] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-70 disabled:bg-[#0a0e17] transition-all"
                />
              </div>
            </div>

            <div className="h-px w-full bg-slate-800/60" />

            {/* Campo: Username */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-300">
                  Nombre de Usuario
                </label>
                <p className="text-xs text-slate-500 mt-1">Debe ser único en el servidor.</p>
              </div>
              <div className="md:col-span-2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-medium">
                  @
                </span>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className={`w-full bg-[#0f1522] border rounded-lg pl-9 pr-12 py-2.5 text-slate-200 focus:outline-none focus:ring-1 transition-all disabled:opacity-70 disabled:bg-[#0a0e17] ${
                    isEditing && usernameAvailable === false ? 'border-red-500 focus:ring-red-500' : 
                    isEditing && usernameAvailable === true ? 'border-cyan-500 focus:ring-cyan-500' : 'border-slate-700'
                  }`}
                />
                
                {isEditing && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    {isValidating && <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />}
                    {!isValidating && usernameAvailable === true && <Check className="w-4 h-4 text-cyan-500" />}
                    {!isValidating && usernameAvailable === false && <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded">Ocupado</span>}
                  </div>
                )}
              </div>
            </div>
            
            {/* Acciones de guardado */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button 
                  disabled={!usernameAvailable || isValidating}
                  className="flex items-center gap-2 bg-cyan-500 text-[#0f1522] hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            )}
          </div>

          {/* Zona Peligrosa */}
          <div className="mt-8 bg-red-950/10 border border-red-900/30 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold flex items-center gap-2 mb-2 text-lg">
              <AlertTriangle className="w-5 h-5" /> Zona de Peligro
            </h3>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm text-slate-400 max-w-lg">
                Una vez que elimines tu cuenta, perderás acceso a todas las salas de estudio y mensajes. Esta acción es irreversible.
              </p>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-sm font-semibold whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Eliminación (Sin cambios estructurales, solo ajustes de color) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] backdrop-blur-sm px-4">
          <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                ¿Estás absolutamente seguro?
              </h3>
              <p className="text-slate-400 text-sm mb-8">
                Esta acción no se puede deshacer. Tu perfil, historial de chats y acceso a las salas de estudio se eliminarán de forma permanente.
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    console.log("Cuenta eliminada");
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 py-3 bg-red-600 text-white hover:bg-red-500 rounded-lg transition-colors font-semibold shadow-lg shadow-red-600/20"
                >
                  Sí, eliminar todo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 