'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Framer Motion values for spring physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only initialize on devices with a fine pointer (mouse/trackpad, not touch)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const mouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('magnetic') ||
        target.classList.contains('swiper-button-next') ||
        target.classList.contains('swiper-button-prev')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  // Don't render on server
  if (typeof window === 'undefined') return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          body, a, button, .magnetic, select, textarea, input {
            cursor: none !important;
          }
        }
      `}} />

      {/* Trailing Ring */}
      <motion.div
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(13, 33, 59, 0.08)' : 'transparent',
          border: isHovering ? '1px solid rgba(13, 33, 59, 0.1)' : '2px solid rgba(13, 33, 59, 0.4)'
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
      
      {/* Center Dot */}
      <motion.div 
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: '12px',
          left: '12px',
          width: '8px',
          height: '8px',
          backgroundColor: '#0D213B',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          translateX: cursorXSpring, // Uses same spring to stay centered inside ring
          translateY: cursorYSpring,
          opacity: isVisible ? (isHovering ? 0 : 1) : 0,
        }}
      />
    </>
  );
}
