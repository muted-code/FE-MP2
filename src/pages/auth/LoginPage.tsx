import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import PageWrapper from '../../components/layout/PageWrapper';

const ALLOWED_DOMAIN = '@correounivalle.edu.co';

const schema = z.object({
  email: z.string()
    .email('Correo electrónico inválido')
    .refine((email) => email.endsWith(ALLOWED_DOMAIN), {
      message: 'Solo se permiten correos institucionales (@correounivalle.edu.co)',
    }),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, user, firebaseUser, loading } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!loading && firebaseUser) {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/complete-profile', { replace: true });
      }
    }
  }, [loading, firebaseUser, user, navigate]);

  const onSubmit = async (data: FormData) => {
    setErrorMsg('');
    try {
      await loginWithEmail(data.email, data.password);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMsg('Credenciales inválidas. Verifica tu correo y contraseña.');
      } else {
        setErrorMsg('Ocurrió un error al intentar iniciar sesión.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/unauthorized-domain') {
        setErrorMsg(error.message || 'Solo se permiten correos institucionales (@correounivalle.edu.co)');
      } else {
        setErrorMsg('Error al iniciar sesión con Google.');
      }
    }
  };

  return (
    <PageWrapper ariaLabel="Página de inicio de sesión">
      {/* Contenedor principal ajustado: max-w-lg para más anchura, mt-4 mb-8 para evitar que se corte */}
      <div className="w-full max-w-lg mx-auto glass-panel p-8 sm:p-12 rounded-2xl relative overflow-hidden mt-4 mb-8">
        {/* Glow effect in background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-[50px] pointer-events-none"></div>

        <h1 className="text-3xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">
          Iniciar Sesión
        </h1>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            {errorMsg}
          </div>
        )}

        <form 
          role="form" 
          aria-label="Formulario de inicio de sesión" 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 relative z-10"
        >
          <div className="space-y-3">
            <label htmlFor="email" className="block text-sm font-medium text-muted ml-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-5 py-3.5 input-neon rounded-xl text-text
                ${errors.email ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
              `}
              placeholder="tu.nombre@correounivalle.edu.co"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="block text-sm font-medium text-muted ml-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full px-5 py-3.5 input-neon rounded-xl text-text
                ${errors.password ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
              `}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 py-4 bg-gradient-to-r from-primary to-secondary hover:from-[#00c3ff] hover:to-[#ff0055] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex justify-center items-center gap-2 transform hover:scale-[1.02] active:scale-95" 
            disabled={isSubmitting || loading}
          >
            <LogIn size={20} />
            {isSubmitting || loading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>

        <div className="my-8 flex items-center relative z-10">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="px-4 text-muted text-sm uppercase tracking-widest">O</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full px-4 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-3 backdrop-blur-sm transform hover:scale-[1.02] relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar con Google
        </button>

        <p className="mt-10 text-center text-sm text-muted relative z-10">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary hover:text-[#00c3ff] hover:underline font-medium transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;