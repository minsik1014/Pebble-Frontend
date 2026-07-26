import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

interface UseInViewOnceOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInViewOnce<T extends Element>(
  targetRef: RefObject<T | null>,
  {
    threshold = 0.25,
    rootMargin = '0px',
  }: UseInViewOnceOptions = {},
) {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target || hasEntered) return;

    if (!('IntersectionObserver' in window)) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasEntered(true);
        observer.disconnect();
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasEntered, rootMargin, targetRef, threshold]);

  return hasEntered;
}