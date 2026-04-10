'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Webflow-style scroll reveals: SplitType per character + GSAP ScrollTrigger.
 * Skipped when `reducedMotion` is true. No-ops if packages fail to load.
 */
export function useNhSplitHeadlines(rootRef: RefObject<HTMLElement | null>, reducedMotion: boolean | null) {
  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const splitInstances: Array<{ revert: () => void }> = [];
    let gsapCtx: { revert: () => void } | null = null;
    let onLoad: (() => void) | null = null;

    void (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }, splitMod] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('split-type'),
        ]);
        const SplitType = splitMod.default;
        if (cancelled || !rootRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        gsapCtx = gsap.context(() => {
          root.querySelectorAll<HTMLElement>('[data-nh-split]').forEach((node) => {
            const split = new SplitType(node, { types: 'chars' });
            splitInstances.push(split);
            const chars = split.chars;
            if (!chars?.length) return;
            gsap.set(chars, { opacity: 0, y: 26 });
            gsap.to(chars, {
              scrollTrigger: {
                trigger: node,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
              opacity: 1,
              y: 0,
              duration: 0.52,
              stagger: 0.017,
              ease: 'power2.out',
            });
          });
        }, root);

        onLoad = () => ScrollTrigger.refresh();
        window.addEventListener('load', onLoad);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } catch {
        /* optional: dependencies missing in some environments */
      }
    })();

    return () => {
      cancelled = true;
      if (onLoad) window.removeEventListener('load', onLoad);
      gsapCtx?.revert();
      gsapCtx = null;
      splitInstances.forEach((s) => {
        try {
          s.revert();
        } catch {
          /* */
        }
      });
      splitInstances.length = 0;
    };
  }, [rootRef, reducedMotion]);
}
