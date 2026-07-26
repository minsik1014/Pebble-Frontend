import { useRef } from 'react';

import bridgePebble1 from '@/assets/images/landing/bridge-pebble-1.svg';
import bridgePebble2 from '@/assets/images/landing/bridge-pebble-2.svg';
import bridgePebble3 from '@/assets/images/landing/bridge-pebble-3.svg';

import { BRIDGE_SECTION_COPY } from '@/features/landing/constants/bridgeSectionData';
import { useInViewOnce } from '@/features/landing/hooks/useInViewOnce';

import { BridgePebbleRow } from './BridgePebbleRow';

interface BridgeBackgroundLayerProps {
  src: string;
  className: string;
  delay: number;
  isVisible: boolean;
  visibleOpacityClassName: string;
}

function BridgeBackgroundLayer({
  src,
  className,
  delay,
  isVisible,
  visibleOpacityClassName,
}: BridgeBackgroundLayerProps) {
  return (
    <img
      src={src}
      alt=""
      className={[
        'absolute object-contain',
        'transition-[opacity,transform] duration-[900ms]',
        'ease-[cubic-bezier(0.22,1,0.36,1)]',
        'will-change-[opacity,transform]',
        'motion-reduce:translate-y-0',
        'motion-reduce:scale-100',
        'motion-reduce:transition-none',
        className,
        isVisible
          ? `translate-y-0 scale-100 ${visibleOpacityClassName}`
          : 'translate-y-8 scale-[0.96] opacity-0',
      ].join(' ')}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

interface BridgeBackgroundImagesProps {
  isVisible: boolean;
}

function BridgeBackgroundImages({
  isVisible,
}: BridgeBackgroundImagesProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      <BridgeBackgroundLayer
        src={bridgePebble1}
        isVisible={isVisible}
        delay={0}
        visibleOpacityClassName="opacity-70"
        className="left-[857px] top-[-57px] h-[499px] w-[585px]"
      />

      <BridgeBackgroundLayer
        src={bridgePebble2}
        isVisible={isVisible}
        delay={350}
        visibleOpacityClassName="opacity-70"
        className="left-[422px] top-[361px] h-[534px] w-[325px]"
      />

      <BridgeBackgroundLayer
        src={bridgePebble3}
        isVisible={isVisible}
        delay={700}
        visibleOpacityClassName="opacity-90"
        className="left-[-62px] top-[649px] h-[273px] w-[413px]"
      />
    </div>
  );
}

export function BridgeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useInViewOnce(sectionRef);

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full overflow-hidden bg-fill-inverse"
    >
      <BridgeBackgroundImages isVisible={isVisible} />

      <div className="relative z-10">
        <h2 className="absolute left-[100px] top-[240px] h-[70px] w-[845px] text-[54px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          {BRIDGE_SECTION_COPY.title}
        </h2>

        <p className="absolute left-[100px] top-[330px] h-[31px] w-[568px] text-[24px] font-medium leading-[130%] tracking-[-0.01em] text-text-secondary">
          {BRIDGE_SECTION_COPY.description}
        </p>

        <p className="absolute left-[100px] top-[495px] h-[36px] w-[221px] text-[28px] font-medium leading-[130%] tracking-[-0.01em] text-text-strong">
          {BRIDGE_SECTION_COPY.label}
        </p>
      </div>

      <BridgePebbleRow isActive={isVisible} />
    </div>
  );
}