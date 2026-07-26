// src/features/landing/components/HeroBackgroundShapes.tsx

import type { CSSProperties } from 'react';

import vector1 from '@/assets/images/landing/hero-pebble-vector-1.svg';
import vector2 from '@/assets/images/landing/hero-pebble-vector-2.svg';
import vector3 from '@/assets/images/landing/hero-pebble-vector-3.svg';
import vector4 from '@/assets/images/landing/hero-pebble-vector-4.svg';

function popInStyle(targetOpacity: string, delay: number): CSSProperties {
  return {
    '--landing-hero-target-opacity': targetOpacity,
    animationDelay: `${delay}ms`,
  } as CSSProperties;
}

export function HeroBackgroundShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Vector 3 */}
      <img
        src={vector3}
        alt=""
        style={popInStyle('1', 900)}
        className="landing-hero-pop-in absolute left-[400px] top-[-80px] h-[498.912px] w-[585.439px] object-contain"
      />

      {/* Vector 1 */}
      <img
        src={vector1}
        alt=""
        style={popInStyle('1', 1050)}
        className="landing-hero-pop-in absolute left-[927px] top-[-30px] h-[680.443px] w-[550.439px] object-contain"
      />

      {/* Vector 2 */}
      <img
        src={vector2}
        alt=""
        style={popInStyle('1', 1200)}
        className="landing-hero-pop-in absolute left-[1036px] top-[512px] h-[273.221px] w-[512.699px] object-contain"
      />

      {/* Vector 4 */}
      <img
        src={vector4}
        alt=""
        style={popInStyle('1', 1650)}
        className="landing-hero-pop-in absolute left-[0px] top-[906.62px] h-[700.443px] w-[325.439px] object-contain"
      />
    </div>
  );
}