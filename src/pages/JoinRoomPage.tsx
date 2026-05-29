import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoomById } from '../services/roomService';
import PageWrapper from '../components/layout/PageWrapper'; // Ajusta la ruta si es necesario

const JoinRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Esperamos a saber si el usuario está autenticado
    if (loading) return;

    // Si no está logueado, lo mandamos al login, pero guardamos a dónde quería ir
    if (!user) {
      localStorage.setItem('redirectAfterLogin', `/join/${id}`);
      navigate('/login');
      return;
    }

    const validateAndJoin = async () => {
      try {
        if (!id) throw new Error('ID inválido');
        
        // Verificamos con el backend si la sala existe
        const room = await getRoomById(id);
        
        // Si todo está bien, lo mandamos al dashboard pasando el ID de la sala
        // para que el dashboard sepa qué sala abrir automáticamente
        navigate('/dashboard', { state: { joinRoomId: room.id, joinRoomName: room.name } });
        
      } catch (err) {
        console.error(err);
        setError('El enlace de invitación es inválido, expiró o la sala fue eliminada.');
      }
    };

    validateAndJoin();
  }, [id, user, loading, navigate]);

  if (error) {
    return (
      <PageWrapper ariaLabel="Error al unirse">
        <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error al unirse a la sala</h1>
          <p className="text-muted mb-8 max-w-md">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-primary hover:bg-cyan-400 text-white rounded-lg transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper ariaLabel="Uniéndose a la sala">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-white font-medium animate-pulse">Conectando a la sala de estudio...</p>
      </div>
    </PageWrapper>
  );
};

export default JoinRoomPage; 