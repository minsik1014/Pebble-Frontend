// @/features/auth/components/ForgotPasswordForm.tsx
import React from "react";

// 비밀번호 찾기 화면의 배경 조약돌 이미지
import pebble01 from "@/assets/icons/pebble01.png";
import pebble02 from "@/assets/icons/pebble02.png";
import pebble03 from "@/assets/icons/pebble03.png";
import { AuthErrorMessage } from "./AuthErrorMessage";
import { Header } from "./Header";

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px] flex-shrink-0">
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M21.034 12a10.448 10.448 0 0 0-2.012-3.777M11.542 4.427A10.417 10.417 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772m-3.6-3.6a3.5 3.5 0 1 1-4.95-4.95 3.5 3.5 0 0 1 4.95 4.95Z" />
    )}
  </svg>
);

interface ForgotPasswordFormProps {
  step: 1 | 2 | 3;
  email: string;
  newPassword: string;
  passwordConfirm: string;
  showPw: boolean;
  showPwConfirm: boolean;
  errors: { email?: string; newPassword?: string; passwordConfirm?: string };
  shakeTarget: { email?: boolean; newPassword?: boolean; passwordConfirm?: boolean };
  isFormValid: boolean;
  onChange: (field: string, value: string) => void;
  onFieldBlur: (field: "email" | "newPassword" | "passwordConfirm") => void;
  onTogglePw: () => void;
  onTogglePwConfirm: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordForm = ({
  step,
  email,
  newPassword,
  passwordConfirm,
  showPw,
  showPwConfirm,
  errors,
  shakeTarget,
  isFormValid,
  onChange,
  onFieldBlur,
  onTogglePw,
  onTogglePwConfirm,
  onSubmit,
  onBackToLogin,
}: ForgotPasswordFormProps) => {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative overflow-hidden [font-family:'Pretendard',sans-serif]">
      
      {/* 조약돌 배경은 이메일을 입력하는 첫 단계에서만 노출합니다. */}
      {step === 1 && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* 폼의 가운데를 기준으로 배치하고, 1 → 2 → 3 순서로 같은 속도로 나타냅니다. */}
          <img
            src={pebble01}
            alt=""
            className="forgot-password-pebble hidden sm:block w-[380px] bottom-[-70px] left-[calc(50%-415px)]"
            style={{ "--pebble-opacity": 0.07, "--pebble-delay": "0ms" } as React.CSSProperties}
          />
          <img
            src={pebble02}
            alt=""
            className="forgot-password-pebble hidden sm:block w-[500px] bottom-[-80px] left-[calc(50%+55px)]"
            style={{ "--pebble-opacity": 0.09, "--pebble-delay": "500ms" } as React.CSSProperties}
          />
          <img
            src={pebble03}
            alt=""
            className="forgot-password-pebble hidden sm:block w-[480px] bottom-[165px] left-[calc(50%+400px)]"
            style={{ "--pebble-opacity": 0.11, "--pebble-delay": "1000ms" } as React.CSSProperties}
          />
        </div>
      )}

      {/* 상단 GNB 헤더 영역 */}
      <Header />

      {/* 메인 폼 영역 */}
      <main className={`flex-1 flex flex-col items-center px-[16px] relative z-10 bg-transparent ${step === 2 ? "justify-start pt-[131px]" : "justify-center py-[40px] md:py-[60px]"}`}>
        <div className={`w-full flex flex-col bg-transparent rounded-2xl ${step === 2 ? "max-w-[692px] h-[350px] p-[32px]" : "max-w-[440px] p-6 sm:p-0"}`}>
          
          {/* 뒤로가기 및 타이틀 */}
          <div className={`flex items-center relative ${step === 2 ? "gap-[16px] mb-[23px]" : "mb-[8px]"}`}>
            <button
              type="button"
              onClick={onBackToLogin}
              className={`${step === 2 ? "relative w-[24px] h-[33px] flex items-center justify-center" : "absolute left-0"} text-[#737373] hover:text-[#111111] transition-colors flex-shrink-0`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[20px] h-[20px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className={`auth-title ${step === 2 ? "leading-[33px]" : "mx-auto pl-[20px]"}`}>
              {step === 1 && "비밀번호를 잊으셨나요?"}
              {step === 2 && "임시 비밀번호 발송 완료"}
              {step === 3 && "비밀번호 변경"}
            </h2>
          </div>

          <p className={`auth-body whitespace-pre-line text-[#171717] ${step === 2 ? "text-left mb-[38px]" : "text-center mt-[4px] mb-[32px] sm:mb-[40px]"}`}>
            {step === 1 && "가입하신 이메일로 임시 비밀번호를 보내드릴게요"}
            {step === 2 && "로그인 후 비밀번호를 변경해 주세요"}
            {step === 3 && `임시 비밀번호로 로그인되었어요\n새 비밀번호를 설정해 주세요`}
          </p>

          <form onSubmit={onSubmit} className="flex flex-col w-full text-left" noValidate>
            
            {/* STEP 1: 이메일 입력 단계 */}
            {step === 1 && (
              <div className={`flex flex-col mb-[32px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
                <label className="auth-label mb-[8px]">이메일<span className="auth-required">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onChange("email", e.target.value)}
                  onBlur={() => onFieldBlur("email")}
                  placeholder="이메일을 입력해 주세요"
                  className={`auth-input px-[12px] ${errors.email ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
                />
                {errors.email && (
                  <AuthErrorMessage className="mt-[8px]">{errors.email}</AuthErrorMessage>
                )}
              </div>
            )}

            {/* STEP 2: 발송 완료 단계 */}
            {step === 2 && (
              <div className="flex flex-col mb-[40px] w-full">
                <div className="w-full h-[72px] bg-[#FAFAFA] rounded-[12px] px-[20px] flex items-center gap-[16px]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[24px] h-[24px] text-[#737373] flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <div className="flex min-w-0 flex-col text-left leading-[20px]">
                    <span className="text-[15px] font-medium tracking-[-0.15px] text-[#171717] break-all">{email || "sample@sample.com"} <span className="font-normal text-[#737373]">으로</span></span>
                    <span className="text-[14px] font-normal tracking-[-0.14px] text-[#737373]">임시 비밀번호를 전송했어요</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: 비밀번호 설정 변경 단계 */}
            {step === 3 && (
              <>
                {/* 새 비밀번호 */}
                <div className={`flex flex-col mb-[20px] relative ${shakeTarget.newPassword && errors.newPassword ? "animate-shake" : ""}`}>
                  <label className="auth-label mb-[8px]">새 비밀번호<span className="auth-required">*</span></label>
                  <div className="relative w-full">
                    <input
                      type={showPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => onChange("newPassword", e.target.value)}
                      onBlur={() => onFieldBlur("newPassword")}
                      placeholder="비밀번호를 입력해 주세요"
                      className={`auth-input pl-[12px] pr-[48px] ${errors.newPassword ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
                    />
                    <button type="button" onClick={onTogglePw} className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444] flex items-center justify-center">
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {errors.newPassword ? (
                    <AuthErrorMessage className="mt-[8px]">{errors.newPassword}</AuthErrorMessage>
                  ) : (
                    <div className="mt-[8px] text-[12px] text-[#999999] text-left">8자 이상, 영문·숫자 포함</div>
                  )}
                </div>

                {/* 새 비밀번호 확인 */}
                <div className={`flex flex-col mb-[32px] relative ${shakeTarget.passwordConfirm && errors.passwordConfirm ? "animate-shake" : ""}`}>
                  <label className="auth-label mb-[8px]">새 비밀번호 확인<span className="auth-required">*</span></label>
                  <div className="relative w-full">
                    <input
                      type={showPwConfirm ? "text" : "password"}
                      value={passwordConfirm}
                      onChange={(e) => onChange("passwordConfirm", e.target.value)}
                      onBlur={() => onFieldBlur("passwordConfirm")}
                      placeholder="비밀번호를 한 번 더 입력해 주세요"
                      className={`auth-input pl-[12px] pr-[48px] ${errors.passwordConfirm ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
                    />
                    <button type="button" onClick={onTogglePwConfirm} className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444] flex items-center justify-center">
                      <EyeIcon open={showPwConfirm} />
                    </button>
                  </div>
                  {errors.passwordConfirm && (
                    <AuthErrorMessage className="mt-[8px]">{errors.passwordConfirm}</AuthErrorMessage>
                  )}
                </div>
              </>
            )}

            {/* 하단 공통 제출 버튼 */}
            <button
              type="submit"
              disabled={step !== 2 && !isFormValid}
              className={`w-full auth-body text-white transition-colors ${step === 2 ? "h-[56px] rounded-[12px]" : "h-[52px] rounded-[12px]"}
                ${(step === 2 || isFormValid) ? "bg-[#111111] hover:bg-[#222222] cursor-pointer" : "bg-[#737373] cursor-not-allowed"}`}
            >
              {step === 1 && "임시 비밀번호 발급받기"}
              {step === 2 && "로그인하러 가기"}
              {step === 3 && "비밀번호 변경"}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
};
