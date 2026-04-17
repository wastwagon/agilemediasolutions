'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src?: string;
  className?: string;
  offset?: number;
  children?: React.ReactNode;
}

function cssUrl(value: string): string {
  const s = value.trim();
  if (!s) return '';
  return `url("${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
}

export default function ParallaxImage({ src, className = '', offset = 50, children }: ParallaxImageProps) {
  const ref = useRef(null);
  const bgImage = src?.trim() ? cssUrl(src) : undefined;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Transform the Y value from -offset to +offset based on scroll progress
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`parallax-wrapper ${className}`} style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}>
      <motion.div
        style={{
          y,
          width: '100%',
          height: `calc(100% + ${offset * 2}px)`,
          position: 'absolute',
          top: -offset,
          backgroundImage: bgImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        className="parallax-inner"
      />
      {/* Allows layering content over the parallax background if needed */}
      {children && (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      )}
    </div>
  );
}
