'use client';

import { useEffect } from 'react';

/**
 * Safari can restore stale DOM from BFCache on back/forward navigation.
 * If restored from BFCache, force a fresh reload once.
 */
export default function SafariBfcacheGuard() {
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return null;
}
