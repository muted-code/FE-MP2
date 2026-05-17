import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import PageWrapper from '../../components/layout/PageWrapper';

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres').max(20, 'Máximo 20 caracteres'),
});

type FormData = z.infer<typeof schema>;

const CompleteProfilePage: React.FC = () => {
  const { firebaseUser, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const usernameValue = watch('username');

  useEffect(() => {
    const checkUser = async () => {
      if (usernameValue && usernameValue.length >= 3) {
        setChecking(true);
        try {
          const available = await authService.checkUsername(usernameValue);
          setIsAvailable(available);
          if (errorMsg === 'Error al conectar con el servidor. Verifica que el backend esté encendido.') {
            setErrorMsg('');
          }
        } catch (error) {
          setIsAvailable(null);
          setErrorMsg('Error al conectar con el servidor. Verifica que el backend esté encendido.');
        } finally {
          setChecking(false);
        }
      } else {
        setIsAvailable(null);
      }
    };

    const timeoutId = setTimeout(checkUser, 500);
    return () => clearTimeout(timeoutId);
  }, [usernameValue]);

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: FormData) => {
    if (!isAvailable) {
      setErrorMsg('El nombre de usuario no está disponible');
      return;
    }
    
    setErrorMsg('');
    try {
      await authService.register({
        name: firebaseUser.displayName || 'Usuario',
        lastName: '',
        username: data.username,
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || '',
      });
      await refreshProfile();
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || 'Error al completar el perfil');
    }
  };

  return (
    <PageWrapper ariaLabel="Completar perfil">
      <div className="max-w-md mx-auto bg-surface p-8 rounded-xl shadow-lg border border-white/5">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">Completar Perfil</h1>
        <p className="text-center text-muted mb-6">
          Necesitamos un nombre de usuario para terminar de configurar tu cuenta.
        </p>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
            {errorMsg}
          </div>
        )}

        <form 
          role="form" 
          aria-label="Formulario para completar perfil" 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-muted">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`w-full px-4 py-2 bg-bg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text transition-colors
                ${errors.username ? 'border-red-500' : isAvailable === false ? 'border-red-500' : isAvailable === true ? 'border-green-500' : 'border-white/10'}
              `}
              placeholder="tu_usuario"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            {checking && <p className="text-muted text-xs mt-1">Comprobando disponibilidad...</p>}
            {!checking && isAvailable === true && <p className="text-green-500 text-xs mt-1">¡Nombre de usuario disponible!</p>}
            {!checking && isAvailable === false && <p className="text-red-500 text-xs mt-1">Este nombre de usuario ya está en uso.</p>}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={isSubmitting || checking || isAvailable === false}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Registro'}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default CompleteProfilePage;
