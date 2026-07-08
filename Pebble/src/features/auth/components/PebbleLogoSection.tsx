// @/features/auth/components/PebbleLogoSection.tsx
import pebbleLogo from "@/assets/icons/Logo_Pebble3.png"; 

export const PebbleLogoSection = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left select-none" data-id="logo-slogan-section">
      <div className="flex items-center gap-[16px] sm:gap-[24px] mb-[16px] sm:mb-[32px]">
        {/* 핵심 수정: flex-shrink-0을 부여하여 부모 박스가 좁아져도 
          가로세로 비율(Aspect Ratio)을 1:1로 칼같이 유지하면서 줄어들게 만듭니다.
        */}
        <img 
          src={pebbleLogo} 
          alt="Pebble Logo" 
          className="w-[52px] h-[52px] sm:w-[84px] h-[84px] flex-shrink-0 object-contain aspect-square" 
        />
        <h1 className="text-[44px] sm:text-[64px] font-extrabold text-[#111111] tracking-tight">
          Pebble
        </h1>
      </div>
      
      <p className="text-[24px] sm:text-[32px] md:text-[36px] font-bold text-[#222222] tracking-tight leading-[1.3] max-w-[320px] sm:max-w-none break-keep">
        할 일을 가볍게 정리해 볼까요?
      </p>
    </div>
  );
};