import React, { type ReactNode } from 'react';
import Navbar from './Navbar';
import { motion } from 'motion/react';

interface PageWrapperProps {
  children: ReactNode;
  ariaLabel: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, ariaLabel }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-bg selection:bg-primary/30">
      {/* Background decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Animated gradient blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-primary/40 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -60, 0],
            y: [0, 80, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-40 w-[25rem] h-[25rem] bg-secondary/40 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-blue-500/30 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main 
          aria-label={ariaLabel} 
          className="flex-grow container mx-auto px-4 py-12 relative flex flex-col"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
