// src/features/landing/components/StepStructureScrollSection.tsx

import { useRef } from 'react';

import { STEP_STRUCTURE_STAGES } from '@/features/landing/constants/stepStructureData';
import { useInView } from '@/features/landing/hooks/useInView';
import { useLandingScale } from '@/features/landing/hooks/useLandingScale';
import { useStepStructureScroll } from '@/features/landing/hooks/useStepStructureScroll';

import { StepStructureSection } from './StepStructureSection';

const FIGMA_WIDTH = 1440;
const FIGMA_HEIGHT = 1024;
const CARD_TOP = 460;

export function StepStructureScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scale = useLandingScale();

  const stepCount = STEP_STRUCTURE_STAGES.length;
  const stepScrollDistance = (CARD_TOP / stepCount) * scale;

  /*
   * 화면 한 개 높이와 단계 전환에 필요한 스크롤 거리를 더합니다.
   * 콘텐츠는 sticky 화면 안에서 중앙 정렬됩니다.
   */
  const scrollSectionHeight = `calc(
    100vh + ${stepScrollDistance * stepCount}px
  )`;

  const activeStep = useStepStructureScroll({
    sectionRef,
    stepCount,
    stepScrollDistance,
  });

  const isSectionVisible = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-fill-inverse"
      style={{
        height: scrollSectionHeight,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: FIGMA_WIDTH,
            height: FIGMA_HEIGHT,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          <StepStructureSection
            activeStep={activeStep}
            isTextVisible={isSectionVisible}
          />
        </div>
      </div>
    </section>
  );
}