// @/features/auth/components/SignUpForm.tsx
import React from "react";
import { AuthErrorMessage } from "./AuthErrorMessage";
import { EyeIcon } from "./EyeIcon";
import { Link } from "react-router-dom"; // 💡 새로고침 없는 매끄러운 화면 이동을 위해 추가
import { SocialAuthButtons } from './SocialAuthButtons';

interface SignUpFormProps {
  form: {
    email: string;
    password: string;
    passwordConfirm: string;
    agreeTerms: boolean;
  };
  showPw: boolean;
  showPwConfirm: boolean;
  errors: {
    email?: string;
    password?: string;
    passwordConfirm?: string;
  };
  socialErrorMessage: string | null;
  isFormValid: boolean;
  shakeTarget: { email?: boolean; password?: boolean; passwordConfirm?: boolean }; 
  onChange: (field: string, value: any) => void;
  onFieldBlur: (field: "email" | "password" | "passwordConfirm") => void; 
  onTogglePw: () => void;
  onTogglePwConfirm: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialSignUp: (provider: 'google' | 'naver') => void;
}

export const SignUpForm = ({
  form,
  showPw,
  showPwConfirm,
  errors,
  socialErrorMessage,
  isFormValid,
  shakeTarget,
  onChange,
  onFieldBlur,
  onTogglePw,
  onTogglePwConfirm,
  onSubmit,
  onSocialSignUp,
}: SignUpFormProps) => {
  return (
    <div className="w-full max-w-[506px] flex flex-col px-[16px] sm:px-0 mx-auto">
      <h2 className="auth-title mb-[40px] text-left">
        Pebble 시작하기
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col w-full">
        {/* 1. 이메일 필드 */}
        <div className={`flex flex-col mb-[20px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px]">
            이메일<span className="auth-required">*</span>
          </label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onFieldBlur("email")}
            placeholder="이메일을 입력해 주세요"
            className={`auth-input px-[12px] ${errors.email ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
          />
          {errors.email && (
            <AuthErrorMessage className="mt-[8px]">{errors.email}</AuthErrorMessage>
          )}
        </div>

        {/* 2. 비밀번호 필드 */}
        <div className={`flex flex-col mb-[20px] relative ${shakeTarget.password && errors.password ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px]">
            비밀번호<span className="auth-required">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              onBlur={() => onFieldBlur("password")}
              placeholder="비밀번호를 입력해 주세요"
              className={`auth-input pl-[12px] pr-[48px] ${errors.password ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
            />
            <button
              type="button"
              onClick={onTogglePw}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444] transition-colors flex items-center justify-center"
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {errors.password ? (
            <AuthErrorMessage className="mt-[8px]">{errors.password}</AuthErrorMessage>
          ) : (
            <div className="mt-[8px] text-[12px] text-[#999999] text-left">8자 이상, 영문·숫자 포함</div>
          )}
        </div>

        {/* 3. 비밀번호 확인 필드 */}
        <div className={`flex flex-col mb-[24px] relative ${shakeTarget.passwordConfirm && errors.passwordConfirm ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px]">
            비밀번호 확인<span className="auth-required">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPwConfirm ? "text" : "password"}
              value={form.passwordConfirm}
              onChange={(e) => onChange("passwordConfirm", e.target.value)}
              onBlur={() => onFieldBlur("passwordConfirm")}
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              className={`auth-input pl-[12px] pr-[48px] ${errors.passwordConfirm ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
            />
            <button
              type="button"
              onClick={onTogglePwConfirm}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444] transition-colors flex items-center justify-center"
            >
              <EyeIcon open={showPwConfirm} />
            </button>
          </div>
          {errors.passwordConfirm && (
            <AuthErrorMessage className="mt-[8px]">{errors.passwordConfirm}</AuthErrorMessage>
          )}
        </div>

        {/* 4. 약관 동의 체크박스 영역 */}
        <div className="flex items-center mb-[32px] text-left">
          <label className="auth-body flex items-center cursor-pointer select-none text-[#737373]">
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={(e) => onChange("agreeTerms", e.target.checked)}
              className="hidden"
            />
            <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center mr-[8px] transition-colors
              ${form.agreeTerms ? "bg-[#111111] border-[#111111]" : "bg-white border-[#D1D5DB]"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" 
                className={`w-[12px] h-[12px] ${form.agreeTerms ? "text-white" : "text-transparent"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <span>
              [필수]{" "}
              <a href="#terms" className="underline text-[#666666] ml-[4px]">서비스 이용약관</a> 및{" "}
              <a href="#privacy" className="underline text-[#666666]">개인정보 처리방침</a> 동의
            </span>
          </label>
        </div>

        {/* 5. 다음 제출 버튼 */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full h-[52px] text-white rounded-[12px] auth-body transition-colors
            ${isFormValid ? "bg-[#111111] hover:bg-[#222222] cursor-pointer" : "bg-[#737373] cursor-not-allowed"}`}
        >
          다음
        </button>
      </form>

      <div className="my-[40px] flex w-full items-center justify-center gap-[16px]">
        <div className="h-px flex-1 bg-[#D4D4D4]" />
        <span className="text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3]">
          또는
        </span>
        <div className="h-px flex-1 bg-[#D4D4D4]" />
      </div>

      <SocialAuthButtons
        actionLabel="가입하기"
        onSocialAuth={onSocialSignUp}
      />

      {socialErrorMessage && (
        <AuthErrorMessage className="mt-[12px] text-center whitespace-pre-line">
          {socialErrorMessage}
        </AuthErrorMessage>
      )}

      <div className="auth-body mt-[40px] flex justify-center gap-[8px]">
        <span className="text-[#A3A3A3]">이미 계정이 있으신가요?</span>
        <Link to="/login" className="text-[#171717] hover:underline">
          로그인
        </Link>
      </div>
    </div>
  );
};
