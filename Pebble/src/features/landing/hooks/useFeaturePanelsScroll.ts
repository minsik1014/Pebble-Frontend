import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

interface UseFeaturePanelsScrollParams {
  sectionRef: RefObject<HTMLElement>;
  stepCount: number;
  stepScrollDistance: number;
}

export function useFeaturePanelsScroll({
  sectionRef,
  stepCount,
  stepScrollDistance,
}: UseFeaturePanelsScrollParams) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let animationFrameId = 0;

    const updateActiveStep = () => {
      animationFrameId = 0;

      const section = sectionRef.current;

      if (!section) return;

      const sectionRect = section.getBoundingClientRect();
      const passedDistance = Math.max(-sectionRect.top, 0);

      const nextStep = Math.min(
        stepCount - 1,
        Math.floor(passedDistance / stepScrollDistance),
      );

      setActiveStep((previousStep) =>
        previousStep === nextStep ? previousStep : nextStep,
      );
    };

    const handleScroll = () => {
      if (animationFrameId !== 0) return;

      animationFrameId = window.requestAnimationFrame(updateActiveStep);
    };

    updateActiveStep();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);

      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [sectionRef, stepCount, stepScrollDistance]);

  return activeStep;
}