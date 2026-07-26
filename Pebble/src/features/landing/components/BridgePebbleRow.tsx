import { BRIDGE_PEBBLES } from '@/features/landing/constants/bridgeSectionData';

import '../styles/bridgeAnimation.css';

interface BridgePebbleRowProps {
  isActive: boolean;
}

export function BridgePebbleRow({
  isActive,
}: BridgePebbleRowProps) {
  return (
    <div
      role="img"
      aria-label="최근 7일의 징검다리 미리보기"
      className="absolute left-0 top-[571px] z-10 h-[195px] w-full overflow-hidden"
    >
      <div
        className={[
          'absolute left-[-58px] top-0 flex w-max gap-[32px]',
          isActive ? 'landing-bridge-marquee' : '',
        ].join(' ')}
      >
        {[0, 1].map((groupIndex) => (
          <div
            key={groupIndex}
            aria-hidden={groupIndex === 1}
            className="flex shrink-0 gap-[32px]"
          >
            {BRIDGE_PEBBLES.map((pebble) => (
              <div
                key={`${groupIndex}-${pebble.id}`}
                className={[
                  'h-[195px] w-[215px] shrink-0 rounded-[32px]',
                  pebble.className ?? '',
                ].join(' ')}
                style={{
                  backgroundColor: pebble.color,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}