import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ellipse7 from '@/assets/images/landing/final-cta-ellipse-7.svg';
import ellipse8 from '@/assets/images/landing/final-cta-ellipse-8.svg';

import { Button } from '@/components/ui/Button';
import { useInViewOnce } from '@/features/landing/hooks/useInViewOnce';

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
        className="absolute left-[-108px] top-[-277px] h-[1281px] w-[1031px] rotate-[180deg] object-contain opacity-[65%] blur-[60px]"
      />

      {/* Ellipse 7 */}
      <img
        src={ellipse7}
        alt=""
        className="absolute left-[628px] top-[201px] h-[1260px] w-[793px] rotate-[-180deg] object-contain"
      />
    </div>
  );
}

export function FinalCTASection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  /*
   * 마지막 섹션의 약 25%가 화면에 들어왔을 때
   * 텍스트 등장 애니메이션을 실행합니다.
   */
  const hasEntered = useInViewOnce(sectionRef, {
    threshold: 0.25,
    rootMargin: '0px 0px -8% 0px',
  });

  const handleStartClick = () => {
    navigate('/signup');
  };

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full overflow-hidden bg-[#171717]"
    >
      <FinalCTABackgroundShapes />

      <div className="relative z-10 h-full w-full">
        {/* 제목과 설명에만 애니메이션 적용 */}
        <div
          className={[
            'pointer-events-none absolute inset-0',
            'transition-[opacity,transform] duration-[1000ms]',
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
          <h2 className="absolute left-[346px] top-[376px] h-[83px] w-[749px] text-center text-[64px] font-bold leading-[130%] tracking-[-0.01em] text-text-onFill">
            이제, 첫 조약돌을 놓아볼까요?
          </h2>

          <p className="absolute left-[474px] top-[487px] h-[31px] w-[491px] text-center text-[24px] font-medium leading-[130%] tracking-[-0.01em] text-text-quaternary">
            오늘의 작은 할 일이 목표까지 이어지는 첫걸음이 돼요
          </p>
        </div>

        {/* 버튼은 애니메이션 없이 항상 표시 */}
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