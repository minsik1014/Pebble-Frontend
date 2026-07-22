import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

import { LandingCalendarPreview } from './LandingCalendarPreview';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[1366px] w-[1440px] overflow-visible bg-transparent">
      <div className="absolute left-[257px] top-[160px] z-10 w-[926px] text-center">
        <h1 className="text-[72px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          큰 목표를 작은 조약돌처럼 하나씩
        </h1>
      </div>

      <p className="absolute left-[433px] top-[286px] z-10 w-[573px] text-center text-[28px] font-medium leading-[160%] tracking-[-0.01em] text-text-secondary">
        흩어진 목표를 카테고리, 마일스톤, 태스크로 담고
        <br />
        오늘 할 일부터 오래 남을 성취까지 한눈에 관리하세요
      </p>

      <Button
        variant="primary"
        className="absolute left-[624px] top-[440px] z-10 h-[66px] w-[189px] rounded-token-s px-token-xl py-token-l text-[20px] font-semibold leading-[130%] tracking-[-0.01em] shadow-[0_2px_10px_rgba(23,23,23,0.1)]"
        onClick={() => navigate('/signup')}
      >
        무료로 시작하기
      </Button>

      <LandingCalendarPreview />
    </div>
  );
}