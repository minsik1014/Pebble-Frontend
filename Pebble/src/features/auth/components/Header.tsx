// @/components/common/Header.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import pebbleLogo1 from "@/assets/icons/Logo_Pebble3-1.png";

export const Header = (): JSX.Element => {
  const navigate = useNavigate();

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/signup", { replace: true });
  };

  return (
    <header className="w-full h-[72px] md:h-[92px] px-[24px] md:px-[64px] flex items-center justify-between border-b border-gray-50 md:border-none [font-family:'Pretendard',sans-serif]">
      {/* Figma의 Logo (w.text): 44px 심볼과 LaundryGothic 20px 워드마크 */}
      <Link to="/" className="flex items-center gap-[4px] cursor-pointer select-none">
        <img src={pebbleLogo1} alt="" className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] object-contain" />
        <span className="text-[18px] md:text-[20px] font-bold text-[#171717] leading-none [font-family:'LaundryGothic',sans-serif]">Pebble</span>
      </Link>

      {/* 상단 우측 퀵 가입 버튼 세트 */}
      <div className="flex items-center gap-[16px] sm:gap-[24px] text-[14px] sm:text-[15px] font-normal tracking-[-0.15px]">
        <button
          onClick={handleSignUpClick}
          className="text-[#171717] hover:text-[#404040] transition-colors cursor-pointer bg-transparent border-none"
        >
          회원가입
        </button>
        <Link to="/login" className="h-[38px] px-[16px] bg-[#171717] text-white rounded-[8px] text-[13px] hover:bg-[#262626] transition-colors flex items-center">
          로그인
        </Link>
      </div>
    </header>
  );
};
