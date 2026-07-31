
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
       * 사용자가 실제로 이동한 스크롤 거리를 계산합니다.
       */
      const passedDistance = Math.max(-sectionRect.top, 0);

      /*
       * 화면의 시각적 scale과 관계없이 전달받은 고정 거리를
       * 기준으로 현재 단계를 결정합니다.
       *
       * 예를 들어 stepScrollDistance가 360px이면:
       * 0 ~ 359px: 첫 번째 단계
       * 360 ~ 719px: 두 번째 단계
       * 720px 이상: 세 번째 단계
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