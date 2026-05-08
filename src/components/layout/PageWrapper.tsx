import React, { type ReactNode } from 'react';
import Navbar from './Navbar';

interface PageWrapperProps {
  children: ReactNode;
  ariaLabel: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, ariaLabel }) => {
  return (
    <div className="min-height-screen flex flex-col">
      <Navbar />
      <main 
        aria-label={ariaLabel} 
        className="flex-grow container mx-auto px-4 py-8"
      >
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
