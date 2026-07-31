// src/features/landing/components/BridgeSection.tsx

import { useRef } from 'react';

import bridgePebble1 from '@/assets/images/landing/bridge-pebble-1.svg';
import bridgePebble2 from '@/assets/images/landing/bridge-pebble-2.svg';
import bridgePebble3 from '@/assets/images/landing/bridge-pebble-3.svg';

import { BRIDGE_SECTION_COPY } from '@/features/landing/constants/bridgeSectionData';
import { useInView } from '@/features/landing/hooks/useInView';

import { BridgePebbleRow } from './BridgePebbleRow';

interface BridgeBackgroundLayerProps {
  src: string;
  className: string;
  delay: number;
  isVisible: boolean;
}

function BridgeBackgroundLayer({
  src,
  className,
  delay,
  isVisible,
}: BridgeBackgroundLayerProps) {
  return (
    <img
      src={src}
      alt=""
      className={[
        'absolute object-contain',
        'will-change-[opacity,transform]',
        className,
      ].join(' ')}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translate3d(0, 0, 0) scale(1)'
          : 'translate3d(0, 40px, 0) scale(0.94)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '1800ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
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
        delay={1400}
        className="left-[857px] top-[-57px] h-[499px] w-[585px]"
      />

      <BridgeBackgroundLayer
        src={bridgePebble2}
        isVisible={isVisible}
        delay={2200}
        className="left-[422px] top-[361px] h-[534px] w-[325px]"
      />

      <BridgeBackgroundLayer
        src={bridgePebble3}
        isVisible={isVisible}
        delay={3000}
        className="left-[-62px] top-[649px] h-[273px] w-[413px]"
      />
    </div>
  );
}

export function BridgeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 기존 애니메이션 시작 시점 사용
  const hasEntered = useInView(sectionRef);

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full overflow-hidden bg-transparent"
    >
      <BridgeBackgroundImages isVisible={hasEntered} />

      {/* 메인 제목과 설명에만 등장 애니메이션 적용 */}
      <div
        className={[
          'pointer-events-none absolute inset-0 z-10',
          'transition-[opacity,transform] duration-[1400ms]',
          'ease-[cubic-bezier(0.22,1,0.36,1)]',
          'will-change-[opacity,transform]',
          'motion-reduce:translate-y-0',
          'motion-reduce:opacity-100',
          'motion-reduce:transition-none',
          hasEntered
            ? 'translate-y-0 opacity-100'
            : 'translate-y-12 opacity-0',
        ].join(' ')}
      >
        <h2 className="absolute left-[100px] top-[240px] h-[70px] w-[845px] text-[54px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          {BRIDGE_SECTION_COPY.title}
        </h2>

        <p className="absolute left-[100px] top-[330px] h-[31px] w-[568px] text-[24px] font-medium leading-[130%] tracking-[-0.01em] text-text-secondary">
          {BRIDGE_SECTION_COPY.description}
        </p>
      </div>

      {/* 애니메이션 없이 항상 표시 */}
      <p className="absolute left-[100px] top-[495px] z-10 h-[36px] w-[221px] text-[28px] font-medium leading-[130%] tracking-[-0.01em] text-text-strong">
        {BRIDGE_SECTION_COPY.label}
      </p>

      {/* 등장 애니메이션 없이 항상 표시 및 이동 */}
      <BridgePebbleRow />
    </div>
  );
}
