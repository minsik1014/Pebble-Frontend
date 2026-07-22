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
        'w-full bg-transparent [font-family:\'Pretendard\',sans-serif]',
        isLanding ? 'h-[108px]' : 'h-[95px]',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-full w-full items-center justify-between',
          isLanding ? 'px-[100px]' : 'px-[64px]',
        ].join(' ')}
      >
        <Link
          to="/"
          aria-label="Pebble 홈으로 이동"
          className="flex h-[44px] w-[122px] shrink-0 cursor-pointer select-none items-center gap-[4px]"
        >
          <img
            src={pebbleLogo}
            alt=""
            className="h-[44px] w-[44px] shrink-0 object-contain"
          />

          <span className="h-[23px] w-[74px] shrink-0 text-[20px] font-bold leading-none tracking-normal text-[#171717] [font-family:'LaundryGothic',sans-serif]">
            Pebble
          </span>
        </Link>

        {isLanding ? (
          <div className="flex h-[44px] w-[252px] shrink-0 items-center gap-[12px]">
            <Button
              variant="secondary"
              className="h-[44px] w-[87px] shrink-0 whitespace-nowrap rounded-token-s px-token-l py-0 text-[18px] font-medium leading-[150%] text-[#171717] [font-family:'Pretendard',sans-serif]"
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>

            <Button
              variant="primary"
              className="h-[44px] w-[153px] shrink-0 whitespace-nowrap rounded-token-s px-token-l py-0 text-[18px] font-medium leading-[150%] text-white [font-family:'Pretendard',sans-serif]"
              onClick={() => navigate('/signup')}
            >
              무료로 시작하기
            </Button>
          </div>
        ) : (
          <div className="flex h-[47px] shrink-0 items-center gap-[12px]">
            <Button
              variant="secondary"
              className="h-[47px] min-w-[91px] shrink-0 whitespace-nowrap rounded-[12px] bg-white px-[16px] py-[12px] text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-[#000000] hover:bg-white [font-family:'Pretendard',sans-serif]"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </Button>

            <Button
              variant="primary"
              className="h-[47px] w-[76px] shrink-0 whitespace-nowrap rounded-[12px] px-[16px] py-[12px] text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-white [font-family:'Pretendard',sans-serif]"
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}