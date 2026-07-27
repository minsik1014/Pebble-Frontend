// src/features/landing/components/FeaturePanelsScrollSection.tsx

import { useRef } from 'react';

import { FEATURE_PANEL_DATA } from '@/features/landing/constants/featurePanelData';
import { useFeaturePanelsScroll } from '@/features/landing/hooks/useFeaturePanelsScroll';
import { useInView } from '@/features/landing/hooks/useInView';
import { useLandingScale } from '@/features/landing/hooks/useLandingScale';

import { FeaturePanelsSection } from './FeaturePanelsSection';

const FIGMA_WIDTH = 1440;
const FIGMA_HEIGHT = 1024;
const STEP_SCROLL_DISTANCE = 280;

export function FeaturePanelsScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scale = useLandingScale();

  const stepCount = FEATURE_PANEL_DATA.length;
  const scaledStageHeight = FIGMA_HEIGHT * scale;
  const scaledStepScrollDistance = STEP_SCROLL_DISTANCE * scale;

  const scrollSectionHeight =
    scaledStageHeight + scaledStepScrollDistance * stepCount;

  const activeStep = useFeaturePanelsScroll({
    sectionRef,
    stepCount,
    stepScrollDistance: scaledStepScrollDistance,
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
          <FeaturePanelsSection
            activeStep={activeStep}
            isSectionVisible={isSectionVisible}
          />
        </div>
      </div>
    </section>
  );
}