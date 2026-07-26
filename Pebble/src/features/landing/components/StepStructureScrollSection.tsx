// src/features/landing/components/StepStructureScrollSection.tsx

import { useRef } from 'react';

import { STEP_STRUCTURE_STAGES } from '@/features/landing/constants/stepStructureData';
import { useLandingScale } from '@/features/landing/hooks/useLandingScale';
import { useStepStructureScroll } from '@/features/landing/hooks/useStepStructureScroll';

import { StepStructureSection } from './StepStructureSection';

const FIGMA_WIDTH = 1440;
const FIGMA_HEIGHT = 1024;

/*
 * Figma에서 카드가 시작되는 위치입니다.
 * 카드가 화면에 보이는 동안 전환이 끝나도록
 * 이 거리만 3단계로 나눠 사용합니다.
 */
const CARD_TOP = 460;

export function StepStructureScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scale = useLandingScale();

  const stepCount = STEP_STRUCTURE_STAGES.length;

  const scaledStageHeight = FIGMA_HEIGHT * scale;

  /*
   * 460px을 3단계로 나누므로
   * 기본 화면 기준 단계당 약 153px입니다.
   */
  const stepScrollDistance = (CARD_TOP / stepCount) * scale;

  /*
   * 1024 × 3처럼 과도하게 긴 스크롤 공간을 만들지 않습니다.
   *
   * 고정 화면 높이
   * + CATEGORY 표시 거리
   * + MILESTONE 표시 거리
   * + TASK 표시 거리
   */
  const scrollSectionHeight =
    scaledStageHeight + stepScrollDistance * stepCount;

  const activeStep = useStepStructureScroll({
    sectionRef,
    stepCount,
    stepScrollDistance,
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-fill-inverse"
      style={{
        height: scrollSectionHeight,
      }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: scaledStageHeight,
        }}
      >
        <div
          className="absolute left-1/2 top-0 origin-top"
          style={{
            width: FIGMA_WIDTH,
            height: FIGMA_HEIGHT,
            transform: `translateX(-50%) scale(${scale})`,
          }}
        >
          <StepStructureSection activeStep={activeStep} />
        </div>
      </div>
    </section>
  );
}