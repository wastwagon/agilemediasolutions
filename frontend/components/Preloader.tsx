'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Elegant fade out once hydration is complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Ensures the user sees the branding
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0D213B', // Brand Dark Blue
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F4EBE1' // Heritage Cream
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 600, margin: 0, letterSpacing: '1px' }}>
              AGILE MEDIA
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '4px', fontSize: '0.75rem', opacity: 0.7, textAlign: 'center', margin: '4px 0 0 0' }}>
              SOLUTIONS
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
