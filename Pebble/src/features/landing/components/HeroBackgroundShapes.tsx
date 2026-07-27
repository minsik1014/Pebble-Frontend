// src/features/landing/components/HeroBackgroundShapes.tsx

import vector1 from '@/assets/images/landing/hero-pebble-vector-1.svg';
import vector2 from '@/assets/images/landing/hero-pebble-vector-2.svg';
import vector3 from '@/assets/images/landing/hero-pebble-vector-3.svg';
import vector4 from '@/assets/images/landing/hero-pebble-vector-4.svg';

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
        className="absolute left-[400px] top-[-80px] h-[498.912px] w-[585.439px] object-contain"
      />

      {/* Vector 1 */}
      <img
        src={vector1}
        alt=""
        className="absolute left-[927px] top-[-30px] h-[680.443px] w-[550.439px] object-contain"
      />

      {/* Vector 2 */}
      <img
        src={vector2}
        alt=""
        className="absolute left-[1036px] top-[512px] h-[273.221px] w-[512.699px] object-contain"
      />

      {/* Vector 4 */}
      <img
        src={vector4}
        alt=""
        className="absolute left-[0px] top-[906.62px] h-[700.443px] w-[325.439px] object-contain"
      />
    </div>
  );
}