'use client';

import { useEffect } from 'react';

export function useScrollAnimations(deps: ReadonlyArray<unknown> = []) {
  useEffect(() => {
    const animated = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    animated.forEach((el) => observer.observe(el));

    return () => {
        animated.forEach((el) => observer.unobserve(el));
    };
  }, deps);
}
