// src/features/landing/components/FinalCTASection.tsx

import { useNavigate } from 'react-router-dom';

import ellipse7 from '@/assets/images/landing/final-cta-ellipse-7.svg';
import ellipse8 from '@/assets/images/landing/final-cta-ellipse-8.svg';

import { Button } from '@/components/ui/Button';

function FinalCTABackgroundShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Ellipse 8 */}
      <img
        src={ellipse8}
        alt=""
        className="absolute left-[-398px] top-[-107px] h-[1281px] w-[731px] object-contain"
      />

      {/* Ellipse 7 */}
      <img
        src={ellipse7}
        alt=""
        className="absolute left-[606px] top-[471px] h-[1260px] w-[693px] object-contain"
      />
    </div>
  );
}

export function FinalCTASection() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/signup');
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#171717]">
      <FinalCTABackgroundShapes />

      <div className="relative z-10 h-full w-full">
        <h2 className="absolute left-[346px] top-[376px] h-[83px] w-[749px] text-center text-[64px] font-bold leading-[130%] tracking-[-0.01em] text-text-onFill">
          이제, 첫 조약돌을 놓아볼까요?
        </h2>

        <p className="absolute left-[474px] top-[487px] h-[31px] w-[491px] text-center text-[24px] font-medium leading-[130%] tracking-[-0.01em] text-text-quaternary">
          오늘의 작은 할 일이 목표까지 이어지는 첫걸음이 돼요
        </p>

        <Button
          type="button"
          variant="secondary"
          className="absolute left-[625px] top-[582px] h-[66px] w-[189px] rounded-token-s bg-fill-inverse px-token-xl py-0 text-[20px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong shadow-[0_2px_10px_rgba(23,23,23,0.1)] hover:bg-fill-inverse"
          onClick={handleStartClick}
        >
          무료로 시작하기
        </Button>
      </div>
    </div>
  );
}