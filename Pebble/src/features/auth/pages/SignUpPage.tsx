// @/features/auth/pages/SignUpPage.tsx
import { Header } from "../components/Header";
import { SignUpContainer } from "../containers/SignUpContainer";

export const SignUpPage = (): JSX.Element => {
  return (
    <main className="bg-white w-full min-h-screen flex flex-col overflow-x-hidden [font-family:'Pretendard',sans-serif]" data-id="signup-screen">
      {/* Pebble 로고 GNB 네비게이션 헤더 */}
      <Header />
      
      {/* 정중앙 배치용 컨텐츠 래퍼 영역 */}
      <div className="flex-1 w-full mx-auto flex items-center justify-center pb-[68px] px-[16px]">
        <SignUpContainer />
      </div>
    </main>
  );
};
