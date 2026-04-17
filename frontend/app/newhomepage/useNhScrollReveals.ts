'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Light Webflow-IX-style section reveals: fade + translate on `[data-nh-reveal]` inside the page root.
 */
export function useNhScrollReveals(rootRef: RefObject<HTMLElement | null>, reducedMotion: boolean | null) {
  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    void (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (cancelled || !rootRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          root.querySelectorAll<HTMLElement>('[data-nh-reveal]').forEach((el) => {
            const rect = el.getBoundingClientRect();
            const alreadyNearView = rect.top < window.innerHeight * 0.92;
            gsap.from(el, {
              opacity: 0,
              y: 36,
              duration: 0.72,
              ease: 'power2.out',
              immediateRender: false,
              ...(alreadyNearView
                ? {}
                : {
                    scrollTrigger: {
                      trigger: el,
                      start: 'top 88%',
                      toggleActions: 'play none none none',
                    },
                  }),
            });
          });
        }, root);

        requestAnimationFrame(() => ScrollTrigger.refresh());
      } catch {
        /* GSAP optional */
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
      ctx = null;
    };
  }, [rootRef, reducedMotion]);
}
