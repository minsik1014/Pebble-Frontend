// src/features/landing/components/HeroBackgroundShapes.tsx

import vector1 from '@/assets/images/landing/hero-pebble-vector-1.svg';
import vector2 from '@/assets/images/landing/hero-pebble-vector-2.svg';
import vector3 from '@/assets/images/landing/hero-pebble-vector-3.svg';
import vector4 from '@/assets/images/landing/hero-pebble-vector-4.svg';

export function HeroBackgroundShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-full w-[max(1440px,100vw)] -translate-x-1/2 overflow-hidden"
    >
      <img
        src={vector3}
        alt=""
        className="landing-hero-pop-in absolute left-[27.7778%] top-[-80px] h-[498.912px] w-[40.6555%] object-fill"
        style={{ animationDelay: '700ms' }}
      />

      <img
        src={vector1}
        alt=""
        className="landing-hero-pop-in absolute left-[64.375%] top-[-30px] h-[680.443px] w-[38.225%] object-fill"
        style={{ animationDelay: '900ms' }}
      />

      <img
        src={vector2}
        alt=""
        className="landing-hero-pop-in absolute left-[71.9444%] top-[512px] h-[273.221px] w-[35.6041%] object-fill"
        style={{ animationDelay: '1100ms' }}
      />

      <img
        src={vector4}
        alt=""
        className="landing-hero-pop-in absolute left-0 top-[906.62px] h-[700.443px] w-[22.6%] object-fill"
        style={{ animationDelay: '1650ms' }}
      />
    </div>
  );
}
