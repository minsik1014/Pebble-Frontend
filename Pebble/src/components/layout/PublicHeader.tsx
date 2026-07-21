import { Link, useNavigate } from 'react-router-dom';

import pebbleLogo from '@/assets/icons/Logo_Pebble3-1.png';
import { Button } from '@/components/ui/Button';

type PublicHeaderVariant = 'landing' | 'auth';

interface PublicHeaderProps {
  variant?: PublicHeaderVariant;
}

export function PublicHeader({ variant = 'auth' }: PublicHeaderProps) {
  const navigate = useNavigate();
  const isLanding = variant === 'landing';

  return (
    <header
      className={[
        'flex w-full items-center justify-between [font-family:\'Pretendard\',sans-serif]',
        isLanding ? 'h-[108px] px-[100px]' : 'h-[95px] px-16 py-6',
      ].join(' ')}
    >
      <Link
        to="/"
        aria-label="Pebble 홈으로 이동"
        className="flex h-11 w-[122px] cursor-pointer select-none items-center gap-1"
      >
        <img src={pebbleLogo} alt="" className="size-11 object-contain" />

        <span className="h-[23px] w-[74px] text-[20px] font-bold leading-none tracking-normal text-[#171717] [font-family:'LaundryGothic',sans-serif]">
          Pebble
        </span>
      </Link>

      {isLanding ? (
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="h-11 min-w-[87px] whitespace-nowrap px-token-l py-0 text-[18px] font-medium leading-[150%] text-[#171717] [font-family:'Pretendard',sans-serif]"
            onClick={() => navigate('/login')}
          >
            로그인
          </Button>

          <Button
            variant="primary"
            className="h-11 min-w-[153px] whitespace-nowrap px-token-l py-0 text-[18px] font-medium leading-[150%] [font-family:'Pretendard',sans-serif]"
            onClick={() => navigate('/signup')}
          >
            무료로 시작하기
          </Button>
        </div>
      ) : (
        <div className="flex h-[47px] items-center gap-3">
          <Button
            variant="secondary"
            className="h-[47px] min-w-[91px] whitespace-nowrap rounded-xl px-4 py-3 text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-[#171717] [font-family:'Pretendard',sans-serif]"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </Button>

          <Button
            variant="primary"
            className="h-[47px] min-w-[76px] whitespace-nowrap rounded-xl px-4 py-3 text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-white [font-family:'Pretendard',sans-serif]"
            onClick={() => navigate('/login')}
          >
            로그인
          </Button>
        </div>
      )}
    </header>
  );
}