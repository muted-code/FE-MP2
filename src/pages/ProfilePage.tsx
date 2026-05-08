import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const ProfilePage: React.FC = () => {
  return (
    <PageWrapper ariaLabel="Perfil de usuario">
      <div className="bg-surface p-6 rounded-lg border border-white/5">
        <h1 className="text-2xl font-bold text-primary mb-4">Mi Perfil</h1>
        <p className="text-muted">Página de perfil en construcción...</p>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
