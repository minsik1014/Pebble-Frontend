import pebbleLogo1 from "@/assets/icons/Logo_Pebble3-1.png"; 

export const LoginHeader = (): JSX.Element => {
  return (
    <header className="w-full h-[64px] sm:h-[80px] px-[20px] sm:px-[40px] md:px-[60px] flex items-center justify-between border-b border-gray-50 md:border-none">
      {/* 상단 좌측 미니 로고 */}
      <div className="flex items-center gap-[8px] cursor-pointer">
        <img src={pebbleLogo1} alt="Pebble" className="w-[20px] h-[20px] sm:w-[24px] h-[24px]" />
        <span className="text-[16px] sm:text-[18px] font-bold text-[#111111] tracking-tight">Pebble</span>
      </div>
      
      {/* 상단 우측 퀵 가입 버튼 세트 */}
      <div className="flex items-center gap-[16px] sm:gap-[24px] text-[13px] sm:text-[14px] font-medium">
        <a href="#signup" className="text-[#444444] hover:text-[#111111] transition-colors">회원가입</a>
        <button className="h-[34px] sm:h-[38px] px-[12px] sm:px-[16px] bg-[#111111] text-white rounded-[6px] text-[12px] sm:text-[13px] font-semibold hover:bg-[#222222] transition-colors">
          로그인
        </button>
      </div>
    </header>
  );
};