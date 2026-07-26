// src/features/landing/hooks/useStepStructureScroll.ts

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

interface UseStepStructureScrollParams {
  sectionRef: RefObject<HTMLElement>;
  stepCount: number;
  scaledStageHeight: number;
}

export function useStepStructureScroll({
  sectionRef,
  stepCount,
  scaledStageHeight,
}: UseStepStructureScrollParams) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let animationFrameId = 0;

    const updateActiveStep = () => {
      animationFrameId = 0;

      const section = sectionRef.current;

      if (!section) return;

      const sectionRect = section.getBoundingClientRect();

      const scrollableDistance = Math.max(
        section.offsetHeight - scaledStageHeight,
        1,
      );

      const passedDistance = Math.min(
        Math.max(-sectionRect.top, 0),
        scrollableDistance,
      );

      const progress = passedDistance / scrollableDistance;

      const nextStep = Math.min(
        stepCount - 1,
        Math.max(0, Math.round(progress * (stepCount - 1))),
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
  }, [scaledStageHeight, sectionRef, stepCount]);

  return activeStep;
}