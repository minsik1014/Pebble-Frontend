import { useRef } from 'react';

import { FEATURE_PANEL_DATA } from '@/features/landing/constants/featurePanelData';
import { useFeaturePanelsScroll } from '@/features/landing/hooks/useFeaturePanelsScroll';
import { useLandingScale } from '@/features/landing/hooks/useLandingScale';

import { FeaturePanelsSection } from './FeaturePanelsSection';

const FIGMA_WIDTH = 1440;
const FIGMA_HEIGHT = 1024;

/*
 * 한 단계 전환에 필요한 Figma 기준 스크롤 거리입니다.
 *
 * CATEGORY : 0 ~ 279px
 * TASK     : 280 ~ 559px
 * CALENDAR : 560px 이상
 */
const STEP_SCROLL_DISTANCE = 280;

export function FeaturePanelsScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scale = useLandingScale();

  const stepCount = FEATURE_PANEL_DATA.length;
  const scaledStageHeight = FIGMA_HEIGHT * scale;
  const scaledStepScrollDistance = STEP_SCROLL_DISTANCE * scale;

  /*
   * 마지막 CALENDAR 상태도 일정 거리 동안 볼 수 있도록
   * stepCount만큼 스크롤 공간을 확보합니다.
   */
  const scrollSectionHeight =
    scaledStageHeight + scaledStepScrollDistance * stepCount;

  const activeStep = useFeaturePanelsScroll({
    sectionRef,
    stepCount,
    stepScrollDistance: scaledStepScrollDistance,
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
          <FeaturePanelsSection activeStep={activeStep} />
        </div>
      </div>
    </section>
  );
}