'use client';

import { useEffect } from 'react';

/**
 * Adds `is-visible` to `.animate-on-scroll` elements when they enter the viewport.
 * Re-scans the DOM when nodes are added (e.g. homepage cards after `/api/brands` loads),
 * so async content is not stuck at opacity:0.
 *
 * @param enabled — Pass false on routes where scroll animation should not run (e.g. admin).
 * @param pathKey — Current route key so observers reset on navigation; use `pathname` from Next.js.
 */
export function useScrollAnimations(enabled: boolean, pathKey: string = '') {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const observed = new Set<Element>();

    const observeEl = (el: Element) => {
      if (observed.has(el)) return;
      if (!el.classList.contains('animate-on-scroll')) return;
      observed.add(el);
      observer.observe(el);
    };

    const scan = () => {
      document.querySelectorAll('.animate-on-scroll').forEach(observeEl);
    };

    scan();

    let raf = 0;
    const scheduleScan = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scan();
      });
    };

    const mo = new MutationObserver(scheduleScan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      observed.forEach((el) => observer.unobserve(el));
      observed.clear();
      observer.disconnect();
    };
  }, [enabled, pathKey]);
}
