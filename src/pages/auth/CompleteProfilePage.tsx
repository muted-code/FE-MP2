import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import PageWrapper from '../../components/layout/PageWrapper';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, XCircle, ArrowRight } from 'lucide-react';

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
          className="text-center"
        >
          {firebaseUser?.photoURL ? (
            <img src={firebaseUser.photoURL} alt="Tu avatar" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20 shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary/20 border-4 border-primary/20 shadow-lg flex items-center justify-center text-primary text-3xl font-bold">
              {(firebaseUser?.displayName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Completar Perfil
          </h1>
          <p className="text-muted mb-6">
            Hola <span className="text-white font-medium">{firebaseUser?.displayName?.split(' ')[0] || 'amigo'}</span>, elige un nombre de usuario único para unirte.
          </p>
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
          aria-label="Formulario para completar perfil" 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2 relative"
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
                  ${errors.username ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : isAvailable === false ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : isAvailable === true ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'border-white/10 hover:border-white/30'}
                `}
                placeholder="tu_usuario"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking && <Loader2 className="animate-spin text-muted" size={18} />}
                {!checking && isAvailable === true && <CheckCircle2 className="text-green-500" size={18} />}
                {!checking && isAvailable === false && <XCircle className="text-red-500" size={18} />}
              </div>
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            {!checking && isAvailable === true && <p className="text-green-500 text-xs mt-1">¡Nombre de usuario disponible!</p>}
            {!checking && isAvailable === false && <p className="text-red-500 text-xs mt-1">Este nombre de usuario ya está en uso.</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full flex justify-center items-center gap-2 py-2.5 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              disabled={isSubmitting || checking || isAvailable === false}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
              {isSubmitting ? 'Guardando...' : 'Completar Registro'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </PageWrapper>
  );
};

export default CompleteProfilePage;
