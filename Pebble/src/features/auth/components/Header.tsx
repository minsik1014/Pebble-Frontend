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
    <header className="w-full h-[64px] sm:h-[80px] px-[20px] sm:px-[40px] md:px-[60px] flex items-center justify-between border-b border-gray-50 md:border-none">
      {/* 상단 좌측 미니 로고 */}
      <Link to="/" className="flex items-center gap-[8px] cursor-pointer select-none">
        <img src={pebbleLogo1} alt="Pebble" className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
        <span className="text-[16px] sm:text-[18px] font-bold text-[#111111] tracking-tight">Pebble</span>
      </Link>
      
      {/* 상단 우측 퀵 가입 버튼 세트 */}
      <div className="flex items-center gap-[16px] sm:gap-[24px] text-[13px] sm:text-[14px] font-medium">
        <button 
          onClick={handleSignUpClick} 
          className="text-[#444444] hover:text-[#111111] transition-colors cursor-pointer bg-transparent border-none font-medium"
        >
          회원가입
        </button>
        
        <Link to="/login" className="h-[34px] sm:h-[38px] px-[12px] sm:px-[16px] bg-[#111111] text-white rounded-[6px] text-[12px] sm:text-[13px] font-semibold hover:bg-[#222222] transition-colors flex items-center">
          로그인
        </Link>
      </div>
    </header>
  );
};