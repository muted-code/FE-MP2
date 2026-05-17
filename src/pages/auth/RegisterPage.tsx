import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
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
      <div className="max-w-md mx-auto bg-surface p-8 rounded-xl shadow-lg border border-white/5">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Crear Cuenta</h1>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
            {errorMsg}
          </div>
        )}

        <form 
          role="form" 
          aria-label="Formulario de registro" 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
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
                className={`w-full px-4 py-2 bg-bg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text transition-colors
                  ${errors.firstName ? 'border-red-500' : 'border-white/10'}
                `}
                placeholder="Juan"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-muted">
                Apellidos
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className={`w-full px-4 py-2 bg-bg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text transition-colors
                  ${errors.lastName ? 'border-red-500' : 'border-white/10'}
                `}
                placeholder="Pérez"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
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
              className={`w-full px-4 py-2 bg-bg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text transition-colors
                ${errors.username ? 'border-red-500' : isUsernameAvailable === false ? 'border-red-500' : isUsernameAvailable === true ? 'border-green-500' : 'border-white/10'}
              `}
              placeholder="juanp"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            {checkingUsername && <p className="text-muted text-xs mt-1">Comprobando disponibilidad...</p>}
            {!checkingUsername && isUsernameAvailable === true && <p className="text-green-500 text-xs mt-1">¡Nombre de usuario disponible!</p>}
            {!checkingUsername && isUsernameAvailable === false && <p className="text-red-500 text-xs mt-1">Este nombre de usuario ya está en uso.</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-muted">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 bg-bg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text transition-colors
                ${errors.email ? 'border-red-500' : 'border-white/10'}
              `}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-muted">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 bg-bg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text transition-colors
                ${errors.password ? 'border-red-500' : 'border-white/10'}
              `}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-4"
            disabled={isSubmitting || checkingUsername || isUsernameAvailable === false}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-secondary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
