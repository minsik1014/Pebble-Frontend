// src/features/landing/components/BridgeSection.tsx

import bridgePebble1 from '@/assets/images/landing/bridge-pebble-1.svg';
import bridgePebble2 from '@/assets/images/landing/bridge-pebble-2.svg';
import bridgePebble3 from '@/assets/images/landing/bridge-pebble-3.svg';

import {
  BRIDGE_PEBBLES,
  BRIDGE_SECTION_COPY,
} from '@/features/landing/constants/bridgeSectionData';

function BridgeBackgroundImages() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <img
        src={bridgePebble1}
        alt=""
        className="absolute left-[857px] top-[-57px] h-[499px] w-[585px] object-contain opacity-70"
      />

      <img
        src={bridgePebble2}
        alt=""
        className="absolute left-[422px] top-[361px] h-[534px] w-[325px] object-contain opacity-70"
      />

      <img
        src={bridgePebble3}
        alt=""
        className="absolute left-[-62px] top-[649px] h-[273px] w-[413px] object-contain opacity-90"
      />
    </div>
  );
}

function BridgePebbleRow() {
  return (
    <div
      aria-label="최근 7일의 징검다리 미리보기"
      className="absolute left-[-58px] top-[571px] z-10 flex h-[195px] w-[1697px] gap-[32px]"
    >
      {BRIDGE_PEBBLES.map((pebble) => (
        <div
          key={pebble.id}
          className={[
            'h-[195px] w-[215px] shrink-0 rounded-token-s',
            pebble.className ?? '',
          ].join(' ')}
          style={{ backgroundColor: pebble.color }}
        />
      ))}
    </div>
  );
}

export function BridgeSection() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-fill-inverse">
      <BridgeBackgroundImages />

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

      <BridgePebbleRow />
    </div>
  );
}