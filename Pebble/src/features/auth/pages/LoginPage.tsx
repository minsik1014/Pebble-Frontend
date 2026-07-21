// @/features/auth/pages/LoginPage.tsx
import { Header } from "../components/Header";
import { LoginContainer } from "../containers/LoginContainer";
import { PebbleLogoSection } from "../components/PebbleLogoSection";

export const LoginPage = (): JSX.Element => {
  return (
    <main
      className="bg-white w-full min-h-screen flex flex-col overflow-x-hidden select-none [font-family:'Pretendard',sans-serif]"
      data-id="login-screen"
    >
      {/* 글로벌 상단 GNB (반응형 대응) */}
      <Header />

      {/* 반응형 핵심 레이아웃:
        - 기본(모바일): flex-col (위아래 배치), 패딩 축소, 중앙 정렬
        - 데스크톱(md 이상): flex-row (좌우 배치), 공간 분배, 최대 너비 제한
      */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between px-[24px] sm:px-[40px] md:px-[124px] py-[40px] md:py-0 gap-[60px] md:gap-[80px]">
        
        {/* 좌측: 로고 및 타이틀 슬로건 (모바일에서는 중앙 정렬, 작아짐) */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <PebbleLogoSection />
        </div>

        {/* 우측: 로그인 폼 섹션 (너비 유연하게 대응) */}
        <div className="w-full md:w-auto flex justify-center">
          <LoginContainer />
        </div>
        
      </div>
    </main>
  );
};
