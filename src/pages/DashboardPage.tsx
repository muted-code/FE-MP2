import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageWrapper ariaLabel="Panel de control">
      <div className="bg-surface p-6 rounded-lg border border-white/5">
        <h1 className="text-2xl font-bold text-primary mb-4">Dashboard</h1>
        <p className="text-text">
          Bienvenido, <span className="font-semibold">{user?.name}</span>. 
          Este es tu espacio colaborativo.
        </p>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
