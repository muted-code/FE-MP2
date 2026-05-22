import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import PageWrapper from '../../components/layout/PageWrapper';

const schema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(20, 'Máximo 20 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const { registerWithEmail, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const usernameValue = watch('username');

  useEffect(() => {
    const checkUser = async () => {
      if (usernameValue && usernameValue.length >= 3) {
        setCheckingUsername(true);
        try {
          const available = await authService.checkUsername(usernameValue);
          setIsUsernameAvailable(available);
          if (errorMsg === 'Error al conectar con el servidor. Verifica que el backend esté encendido.') {
            setErrorMsg('');
          }
        } catch (error) {
          setIsUsernameAvailable(null);
          setErrorMsg('Error al conectar con el servidor. Verifica que el backend esté encendido.');
        } finally {
          setCheckingUsername(false);
        }
      } else {
        setIsUsernameAvailable(null);
      }
    };

    const timeoutId = setTimeout(checkUser, 500);
    return () => clearTimeout(timeoutId);
  }, [usernameValue]);

  const onSubmit = async (data: FormData) => {
    if (isUsernameAvailable === false) {
      setErrorMsg('El nombre de usuario no está disponible');
      return;
    }
    
    setErrorMsg('');
    try {
      // 1. Crear usuario en Firebase Auth
      await registerWithEmail(data.email, data.password);
      
      // 2. Guardar el perfil en el Backend
      await authService.register({
        name: `${data.firstName} ${data.lastName}`,
        username: data.username,
        email: data.email,
      });

      // 3. Refrescar el perfil y redirigir
      await refreshProfile();
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('El correo electrónico ya está registrado.');
      } else {
        setErrorMsg('Ocurrió un error al intentar registrarse.');
      }
    }
  };

  return (
    <PageWrapper ariaLabel="Página de registro">
      <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl relative overflow-hidden">
        {/* Glow effect in background */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-[50px] pointer-events-none"></div>

        <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">
          Crear Cuenta
        </h1>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            {errorMsg}
          </div>
        )}

        <form 
          role="form" 
          aria-label="Formulario de registro" 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 relative z-10"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-muted">
                Nombres
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className={`w-full px-4 py-3 input-neon rounded-lg text-text
                  ${errors.firstName ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
                `}
                placeholder="Juan"
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-muted">
                Apellidos
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className={`w-full px-4 py-3 input-neon rounded-lg text-text
                  ${errors.lastName ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
                `}
                placeholder="Pérez"
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-muted">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`w-full px-4 py-3 input-neon rounded-lg text-text
                ${errors.username || isUsernameAvailable === false ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : isUsernameAvailable === true ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''}
              `}
              placeholder="juanp"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            {checkingUsername && <p className="text-muted text-xs mt-1">Comprobando disponibilidad...</p>}
            {!checkingUsername && isUsernameAvailable === true && <p className="text-green-400 text-xs mt-1">¡Nombre de usuario disponible!</p>}
            {!checkingUsername && isUsernameAvailable === false && <p className="text-red-400 text-xs mt-1">Este nombre de usuario ya está en uso.</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-muted">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 input-neon rounded-lg text-text
                ${errors.email ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
              `}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-muted">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full px-4 py-3 input-neon rounded-lg text-text
                ${errors.password ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
              `}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            className={`w-full py-3 mt-6 bg-gradient-to-r from-primary to-secondary hover:from-[#00c3ff] hover:to-[#ff0055] text-white font-bold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex justify-center items-center gap-2 transform hover:scale-[1.02] active:scale-95 ${isSubmitting || checkingUsername || isUsernameAvailable === false ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting || checkingUsername || isUsernameAvailable === false}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted relative z-10">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:text-[#00c3ff] hover:underline font-medium transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
