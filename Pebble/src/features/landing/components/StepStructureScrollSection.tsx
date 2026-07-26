// src/features/landing/components/StepStructureScrollSection.tsx

import { useRef } from 'react';

import { STEP_STRUCTURE_STAGES } from '@/features/landing/constants/stepStructureData';
import { useLandingScale } from '@/features/landing/hooks/useLandingScale';
import { useStepStructureScroll } from '@/features/landing/hooks/useStepStructureScroll';

import { StepStructureSection } from './StepStructureSection';

const FIGMA_WIDTH = 1440;
const FIGMA_HEIGHT = 1024;

export function StepStructureScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scale = useLandingScale();

  const scaledStageHeight = FIGMA_HEIGHT * scale;
  const scrollSectionHeight =
    scaledStageHeight * STEP_STRUCTURE_STAGES.length;

  const activeStep = useStepStructureScroll({
    sectionRef,
    stepCount: STEP_STRUCTURE_STAGES.length,
    scaledStageHeight,
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