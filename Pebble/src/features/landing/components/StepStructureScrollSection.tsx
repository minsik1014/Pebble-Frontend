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
  const scaledStageHeight = FIGMA_HEIGHT * scale;
  const stepScrollDistance = (CARD_TOP / stepCount) * scale;

  const scrollSectionHeight =
    scaledStageHeight + stepScrollDistance * stepCount;

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
          <StepStructureSection
            activeStep={activeStep}
            isTextVisible={isSectionVisible}
          />
        </div>
      </div>
    </section>
  );
}