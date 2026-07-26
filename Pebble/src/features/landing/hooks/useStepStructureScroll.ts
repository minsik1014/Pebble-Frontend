// src/features/landing/hooks/useStepStructureScroll.ts

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

interface UseStepStructureScrollParams {
  sectionRef: RefObject<HTMLElement>;
  stepCount: number;
  stepScrollDistance: number;
}

export function useStepStructureScroll({
  sectionRef,
  stepCount,
  stepScrollDistance,
}: UseStepStructureScrollParams) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let animationFrameId = 0;

    const updateActiveStep = () => {
      animationFrameId = 0;

      const section = sectionRef.current;

      if (!section) return;

      const sectionRect = section.getBoundingClientRect();

      /*
       * sticky 섹션의 top이 화면 상단에 도착한 시점부터
       * 실제 스크롤한 거리를 계산합니다.
       */
      const passedDistance = Math.max(-sectionRect.top, 0);

      /*
       * 전체 1024px 높이를 기준으로 계산하지 않고,
       * 카드 전환용으로 지정한 짧은 거리만 사용합니다.
       *
       * 0 ~ 152px   : CATEGORY
       * 153 ~ 305px : MILESTONE
       * 306px 이상  : TASK
       */
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