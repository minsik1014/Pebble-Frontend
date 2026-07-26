import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export function useInViewOnce<T extends Element>(
  targetRef: RefObject<T | null>,
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target || isInView) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsInView(true);
        observer.disconnect();
      },
      {
        threshold: 0.28,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [isInView, targetRef]);

  return isInView;
}