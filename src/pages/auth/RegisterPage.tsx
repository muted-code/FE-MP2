import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import PageWrapper from '../../components/layout/PageWrapper';

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // Mock login after register
    navigate('/dashboard');
  };

  return (
    <PageWrapper ariaLabel="Página de registro">
      <div className="max-w-md mx-auto bg-surface p-8 rounded-xl shadow-lg border border-white/5">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Crear Cuenta</h1>
        
        <form 
          role="form" 
          aria-label="Formulario de registro" 
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-muted">
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-2 bg-bg border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-muted">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              required
              className="w-full px-4 py-2 bg-bg border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text"
              placeholder="juanp"
            />
          </div>

          <div className="space-y-1">
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

          <div className="space-y-1">
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

          <Button type="submit" variant="primary" className="w-full mt-4">
            Registrarse
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
