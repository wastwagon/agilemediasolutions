'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSectionContent } from '@/lib/siteSectionCms';

const DEFAULT_SPLASH = '/images/opening-launch.webp';
const DEFAULT_MS = 1200;

function clampMs(raw: string | undefined): number {
  const n = Number.parseInt(String(raw || '').trim(), 10);
  if (!Number.isFinite(n)) return DEFAULT_MS;
  return Math.min(8000, Math.max(400, n));
}

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const preloader = useSiteSectionContent('layout.preloader', {
    splashImage: DEFAULT_SPLASH,
    displayDurationMs: String(DEFAULT_MS),
  });

  const durationMs = useMemo(() => clampMs(preloader.displayDurationMs), [preloader.displayDurationMs]);
  const splashUrl = preloader.splashImage?.trim() || DEFAULT_SPLASH;
  const backgroundImage = useMemo(() => `url(${JSON.stringify(splashUrl)})`, [splashUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs]);

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
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
    </AnimatePresence>
  );
}
