import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import PageWrapper from '../../components/layout/PageWrapper';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  return (
    <PageWrapper ariaLabel="Página de inicio de sesión">
      <div className="max-w-md mx-auto bg-surface p-8 rounded-xl shadow-lg border border-white/5">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Iniciar Sesión</h1>
        
        <form 
          role="form" 
          aria-label="Formulario de inicio de sesión" 
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-muted">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 bg-bg border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-muted">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 bg-bg border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-secondary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
