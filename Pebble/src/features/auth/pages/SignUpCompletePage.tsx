import { Header } from "../components/Header";
import { SignUpCompleteContainer } from "../containers/SignUpCompleteContainer";

export const SignUpCompletePage = (): JSX.Element => {
  return (
    <main className="w-full h-dvh bg-white flex flex-col overflow-hidden" data-id="signup-complete-screen">
      <Header />
      <div className="flex-1 min-h-0 w-full flex justify-center items-start pt-[195px] px-[16px] overflow-hidden [@media(max-height:850px)]:pt-[24px]">
        <SignUpCompleteContainer />
      </div>
    </main>
  );
};
