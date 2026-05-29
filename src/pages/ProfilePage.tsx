import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { getProfile, updateProfile, deleteProfile } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import type { User } from '../types';
import axios from 'axios';
import { Camera } from 'lucide-react';

const compressImage = (file: File, maxSize = 256): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d')!;
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ProfilePage: React.FC = () => {
  const { logout, firebaseUser, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<Partial<User>>({ name: '', username: '', email: '' });
  const [avatarData, setAvatarData] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [initialProfileData, setInitialProfileData] = useState<Partial<User>>({ name: '', username: '', email: '' });
  const [initialAvatarData, setInitialAvatarData] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const [toast, setToast] = useState({ isOpen: false, message: '', description: '', type: 'success' as any });

  const hasUnsavedChanges = 
    profileData.name !== initialProfileData.name ||
    profileData.username !== initialProfileData.username ||
    avatarData !== initialAvatarData;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const loadedData = {
          name: data.name || '',
          username: data.username || '',
          email: data.email || ''
        };
        const currentAvatar = data.avatar || firebaseUser?.photoURL || '';
        
        setProfileData(loadedData);
        setAvatarPreview(currentAvatar || null);
        setAvatarData(currentAvatar);
        
        setInitialProfileData(loadedData);
        setInitialAvatarData(currentAvatar);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [firebaseUser]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; 
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      if (!hasUnsavedChanges) return;

      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && link.href.includes(window.location.host)) {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        const url = new URL(link.href);
        setPendingPath(url.pathname + url.search + url.hash);
        setShowUnsavedModal(true); 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [hasUnsavedChanges]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ isOpen: true, message: 'Archivo inválido', description: 'Por favor selecciona un archivo de imagen (JPG, PNG, etc.)', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ isOpen: true, message: 'Archivo muy grande', description: 'La imagen no debe superar los 5MB', type: 'error' });
      return;
    }

    try {
      const compressed = await compressImage(file);
      setAvatarPreview(compressed);
      setAvatarData(compressed);
    } catch {
      setToast({ isOpen: true, message: 'Error', description: 'Error al procesar la imagen.', type: 'error' });
    }
  };

  // NUEVO: Lógica principal de guardado extraída a una función independiente
  const saveProfileData = async (): Promise<boolean> => {
    setSaving(true);
    try {
      await updateProfile({ ...profileData, avatar: avatarData });
      await refreshProfile();
      
      setInitialProfileData(profileData);
      setInitialAvatarData(avatarData);
      
      setToast({ isOpen: true, message: 'Perfil actualizado', description: 'Los cambios se han guardado correctamente.', type: 'success' });
      return true;
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setToast({ 
          isOpen: true, 
          message: 'Error al actualizar', 
          description: err.response?.data?.message || 'El nombre de usuario o email ya está en uso.', 
          type: 'error' 
        });
      } else {
        setToast({ isOpen: true, message: 'Error', description: 'Ocurrió un error al actualizar el perfil.', type: 'error' });
      }
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Handler para el botón normal del formulario
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfileData();
  };

  // NUEVO: Handler para el botón de "Guardar y salir" en el modal
  const handleSaveAndLeave = async () => {
    const success = await saveProfileData();
    if (success) {
      setShowUnsavedModal(false);
      if (pendingPath) {
        navigate(pendingPath);
      }
    }
  };

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedModal(false);
    if (pendingPath) {
      navigate(pendingPath);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProfile();
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error deleting profile:', err);
      setToast({ isOpen: true, message: 'Error', description: 'No se pudo eliminar la cuenta.', type: 'error' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper ariaLabel="Perfil de usuario">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper ariaLabel="Perfil de usuario">
      <div className="max-w-2xl mx-auto w-full">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <h1 className="text-3xl font-bold text-white mb-6">Mi Perfil</h1>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex flex-col items-center mb-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Subir foto de perfil"
              />
              <button
                type="button"
                onClick={handleAvatarClick}
                className="relative w-24 h-24 rounded-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent transition-transform hover:scale-105 active:scale-95"
              >
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Tu avatar" 
                    className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-lg object-cover" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/20 shadow-lg flex items-center justify-center text-primary text-3xl font-bold">
                    {(profileData.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera size={28} className="text-white" />
                </div>
              </button>
              <p className="text-sm text-primary mt-2 font-medium">📷 Haz clic en la imagen para cambiar tu foto</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Nombre</label>
                <input 
                  type="text" 
                  name="name" 
                  value={profileData.name} 
                  onChange={handleChange} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">Nombre de Usuario</label>
              <input 
                type="text" 
                name="username" 
                value={profileData.username} 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                name="email" 
                value={profileData.email} 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all opacity-70"
                disabled 
              />
              <p className="text-xs text-muted mt-2">El correo electrónico no se puede modificar directamente aquí.</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/10">
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-medium transition-all duration-300 border border-red-500/30"
              >
                Eliminar Cuenta
              </button>
              
              <button 
                type="submit" 
                disabled={saving || !hasUnsavedChanges} 
                className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-cyan-400 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* MODAL: Eliminar Cuenta */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 transition-all duration-300">
          <div className="bg-dash-panel border border-red-500/20 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.15)] w-full max-w-sm overflow-hidden transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4 mx-auto">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">¿Eliminar cuenta?</h3>
              <p className="text-sm text-muted/70 text-center mb-6">
                ¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors w-full"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] w-full"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body 
      )}

      {/* MODAL: Cambios sin guardar (Ahora con 3 botones) */}
      {showUnsavedModal && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 transition-all duration-300">
          <div className="bg-dash-panel border border-orange-500/20 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.15)] w-full max-w-sm overflow-hidden transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Cambios sin guardar</h3>
              <p className="text-sm text-muted/70 text-center mb-6">
                Tienes modificaciones en tu perfil. ¿Qué deseas hacer con estos cambios?
              </p>
              <div className="flex flex-col gap-3">
                {/* Botón 1: Guardar y salir (Llamado a la acción principal) */}
                <button
                  type="button"
                  onClick={handleSaveAndLeave}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium bg-primary hover:bg-cyan-400 text-white rounded-lg transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] w-full flex justify-center items-center disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar y salir'}
                </button>
                
                {/* Botón 2: Salir sin guardar (Acción destructiva pero válida) */}
                <button
                  type="button"
                  onClick={handleLeaveWithoutSaving}
                  className="px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors w-full"
                >
                  Salir sin guardar
                </button>
                
                {/* Botón 3: Continuar editando (Neutral) */}
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors w-full"
                >
                  Continuar editando
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body 
      )}

      <Toast 
        isOpen={toast.isOpen} 
        message={toast.message} 
        description={toast.description} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isOpen: false })} 
      />
    </PageWrapper>
  );
};

export default ProfilePage; 