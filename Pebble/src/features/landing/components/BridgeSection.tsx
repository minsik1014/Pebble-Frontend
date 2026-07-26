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
  visibleOpacity: number;
}

function BridgeBackgroundLayer({
  src,
  className,
  delay,
  isVisible,
  visibleOpacity,
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
        opacity: isVisible ? visibleOpacity : 0,
        transform: isVisible
          ? 'translate3d(0, 0, 0) scale(1)'
          : 'translate3d(0, 40px, 0) scale(0.94)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '1400ms',
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
      {/* Pebble 1 */}
      <BridgeBackgroundLayer
        src={bridgePebble1}
        isVisible={isVisible}
        delay={0}
        visibleOpacity={1}
        className="left-[857px] top-[-57px] h-[499px] w-[585px]"
      />

      {/* Pebble 2 */}
      <BridgeBackgroundLayer
        src={bridgePebble2}
        isVisible={isVisible}
        delay={650}
        visibleOpacity={1}
        className="left-[422px] top-[361px] h-[534px] w-[325px]"
      />

      {/* Pebble 3 */}
      <BridgeBackgroundLayer
        src={bridgePebble3}
        isVisible={isVisible}
        delay={1300}
        visibleOpacity={1}
        className="left-[-62px] top-[649px] h-[273px] w-[413px]"
      />
    </div>
  );
}

export function BridgeSection() {
  const pebbleRowTriggerRef = useRef<HTMLDivElement>(null);

  /*
   * 최근 7일 징검다리 영역의 80%가 화면에 들어왔을 때
   * 배경 Pebble과 가로 이동 애니메이션을 실행합니다.
   */
  const hasPebbleRowEntered = useInViewOnce(pebbleRowTriggerRef, {
    threshold: 0.8,
    rootMargin: '0px 0px -2% 0px',
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-fill-inverse">
      <BridgeBackgroundImages isVisible={hasPebbleRowEntered} />

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

      {/* 징검다리 row 노출 시점을 감지하는 투명 영역 */}
      <div
        ref={pebbleRowTriggerRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[571px] h-[195px] w-full"
      />

      <BridgePebbleRow isActive={hasPebbleRowEntered} />
    </div>
  );
}