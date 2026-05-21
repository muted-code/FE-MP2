import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import PageWrapper from '../../components/layout/PageWrapper';
import { motion } from 'motion/react';
import { UserPlus, Loader2, CheckCircle2, XCircle } from 'lucide-react';

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
      await registerWithEmail(data.email, data.password);
      
      await authService.register({
        name: `${data.firstName} ${data.lastName}`,
        username: data.username,
        email: data.email,
      });

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
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        className="max-w-md mx-auto bg-surface/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Crear Cuenta
          </h1>
        </motion.div>
        
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm"
          >
            {errorMsg}
          </motion.div>
        )}

        <form 
          role="form" 
          aria-label="Formulario de registro" 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-muted">
                Nombres
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className={`w-full px-4 py-2.5 bg-bg/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text transition-all duration-300
                  ${errors.firstName ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10 hover:border-white/30'}
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
                className={`w-full px-4 py-2.5 bg-bg/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text transition-all duration-300
                  ${errors.lastName ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10 hover:border-white/30'}
                `}
                placeholder="Pérez"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-1 relative"
          >
            <label htmlFor="username" className="block text-sm font-medium text-muted">
              Nombre de Usuario
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                {...register('username')}
                className={`w-full px-4 py-2.5 bg-bg/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text transition-all duration-300 pr-10
                  ${errors.username ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : isUsernameAvailable === false ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : isUsernameAvailable === true ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'border-white/10 hover:border-white/30'}
                `}
                placeholder="juanp"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingUsername && <Loader2 className="animate-spin text-muted" size={18} />}
                {!checkingUsername && isUsernameAvailable === true && <CheckCircle2 className="text-green-500" size={18} />}
                {!checkingUsername && isUsernameAvailable === false && <XCircle className="text-red-500" size={18} />}
              </div>
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            {!checkingUsername && isUsernameAvailable === true && <p className="text-green-500 text-xs mt-1">¡Nombre de usuario disponible!</p>}
            {!checkingUsername && isUsernameAvailable === false && <p className="text-red-500 text-xs mt-1">Este nombre de usuario ya está en uso.</p>}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-1"
          >
            <label htmlFor="email" className="block text-sm font-medium text-muted">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2.5 bg-bg/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text transition-all duration-300
                ${errors.email ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10 hover:border-white/30'}
              `}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-1"
          >
            <label htmlFor="password" className="block text-sm font-medium text-muted">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2.5 bg-bg/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text transition-all duration-300
                ${errors.password ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10 hover:border-white/30'}
              `}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-2"
          >
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full flex justify-center items-center gap-2 py-2.5 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              disabled={isSubmitting || checkingUsername || isUsernameAvailable === false}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </Button>
          </motion.div>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-sm text-muted"
        >
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-secondary hover:text-primary font-medium transition-colors hover:underline">
            Inicia sesión
          </Link>
        </motion.p>
      </motion.div>
    </PageWrapper>
  );
};

export default RegisterPage;
