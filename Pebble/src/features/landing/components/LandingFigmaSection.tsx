import type { ReactNode } from 'react';

import { useLandingScale } from '@/features/landing/hooks/useLandingScale';

const FIGMA_WIDTH = 1440;
const FIGMA_SECTION_HEIGHT = 1024;

interface LandingFigmaSectionProps {
  children: ReactNode;
  className?: string;
}

export function LandingFigmaSection({
  children,
  className = '',
}: LandingFigmaSectionProps) {
  const scale = useLandingScale();

  return (
    <section
      style={{
        height: FIGMA_SECTION_HEIGHT * scale,
      }}
      className="relative w-full overflow-hidden"
    >
      <div
        style={{
          width: FIGMA_WIDTH,
          height: FIGMA_SECTION_HEIGHT,
          transform: `scale(${scale})`,
        }}
        className={[
          'absolute left-1/2 top-0 origin-top -translate-x-1/2',
          className,
        ].join(' ')}
      >
        {children}
      </div>
    </section>
  );
}