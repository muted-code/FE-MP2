import React from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <PageWrapper ariaLabel="Sala de estudio">
      <div className="bg-surface p-6 rounded-lg border border-white/5">
        <h1 className="text-2xl font-bold text-primary mb-4">Sala de Estudio</h1>
        <p className="text-text mb-2">ID de la sala: <code className="bg-bg px-2 py-1 rounded">{roomId}</code></p>
        <p className="text-muted">Espacio colaborativo en tiempo real próximamente...</p>
      </div>
    </PageWrapper>
  );
};

export default RoomPage;
