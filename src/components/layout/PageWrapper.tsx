import React, { type ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface PageWrapperProps {
  children: ReactNode;
  ariaLabel: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, ariaLabel }) => {
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-bg selection:bg-primary/30 overflow-hidden">
      {/* Background decorations - PS5 style burst on navigation */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={location.pathname + "-bg"}
          initial={{ opacity: 0, scale: 1.5, filter: 'blur(40px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        >
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Animated gradient blobs with burst entrance */}
          <motion.div 
            initial={{ rotate: -90, scale: 0.5 }}
            animate={{ 
              rotate: 0,
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ 
              rotate: { duration: 1.5, ease: "backOut" },
              scale: { duration: 1.5, ease: "backOut" },
              default: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
            }}
            className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-primary/40 rounded-full blur-[120px]"
          />
          <motion.div 
            initial={{ rotate: 90, scale: 0.5 }}
            animate={{ 
              rotate: 0,
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.25, 0.1],
              x: [0, -60, 0],
              y: [0, 80, 0]
            }}
            transition={{ 
              rotate: { duration: 1.2, ease: "backOut" },
              scale: { duration: 1.2, ease: "backOut" },
              default: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
            }}
            className="absolute top-1/4 -left-40 w-[25rem] h-[25rem] bg-secondary/40 rounded-full blur-[100px]"
          />
          <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ 
              y: 0,
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{ 
              y: { duration: 1, ease: "easeOut" },
              default: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-cyan-500/30 rounded-full blur-[120px]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isFirstLoad={isFirstLoad} />
        
        {/* Page Content Transition */}
        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            aria-label={ariaLabel} 
            className="flex-grow container mx-auto px-4 py-12 relative flex flex-col"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PageWrapper;
