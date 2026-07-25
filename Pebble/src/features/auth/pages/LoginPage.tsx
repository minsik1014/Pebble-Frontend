// @/features/auth/pages/LoginPage.tsx
import { Header } from "../components/Header";
import { LoginContainer } from "../containers/LoginContainer";

export const LoginPage = (): JSX.Element => {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden bg-white [font-family:'Pretendard',sans-serif]"
      data-id="login-screen"
    >
      {/* 로그인 화면에서는 상단 브랜드 로고만 노출합니다. */}
      <Header />

      {/* Figma U008: 로그인 카드를 화면 중앙보다 20px 아래에 배치합니다. */}
      <section className="mx-auto flex w-full max-w-[1440px] justify-center px-[16px] pb-[32px] pt-[52px] md:absolute md:left-1/2 md:top-[calc(50%+20px)] md:-translate-x-1/2 md:-translate-y-1/2 md:p-0">
        <LoginContainer />
      </section>
    </main>
  );
};
