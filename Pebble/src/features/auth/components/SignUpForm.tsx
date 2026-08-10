// @/features/auth/components/SignUpForm.tsx
import React from "react";
import { Link } from "react-router-dom";

import { AuthCard } from './AuthCard';
import { AuthDivider } from './AuthDivider';
import { AuthErrorMessage } from "./AuthErrorMessage";
import { EyeIcon } from "./EyeIcon";
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
    <AuthCard title="Pebble 시작하기" dataId="signup-form-section">
      <div className="flex w-full flex-col gap-[40px]">
        <form onSubmit={onSubmit} className="flex w-full flex-col">
        {/* 1. 이메일 필드 */}
        <div className={`flex flex-col mb-[20px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px] text-[16px] font-medium tracking-[-0.16px]">
            이메일<span className="auth-required">*</span>
          </label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onFieldBlur("email")}
            placeholder="이메일을 입력해 주세요"
            className={`auth-input px-[12px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${errors.email ? "!border-fill-danger focus:!border-fill-danger" : ""}`}
          />
          {errors.email && (
            <AuthErrorMessage className="mt-[8px]">{errors.email}</AuthErrorMessage>
          )}
        </div>

        {/* 2. 비밀번호 필드 */}
        <div className={`flex flex-col mb-[20px] relative ${shakeTarget.password && errors.password ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px] text-[16px] font-medium tracking-[-0.16px]">
            비밀번호<span className="auth-required">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              onBlur={() => onFieldBlur("password")}
              placeholder="비밀번호를 입력해 주세요"
              className={`auth-input pl-[12px] pr-[48px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${errors.password ? "!border-fill-danger focus:!border-fill-danger" : ""}`}
            />
            <button
              type="button"
              onClick={onTogglePw}
              aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-text-teritary hover:text-text-primary transition-colors flex items-center justify-center"
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {errors.password ? (
            <AuthErrorMessage className="mt-[8px]">{errors.password}</AuthErrorMessage>
          ) : (
            <div className="mt-[8px] text-[12px] text-text-teritary text-left">8자 이상, 영문·숫자 포함</div>
          )}
        </div>

        {/* 3. 비밀번호 확인 필드 */}
        <div className={`flex flex-col mb-[24px] relative ${shakeTarget.passwordConfirm && errors.passwordConfirm ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px] text-[16px] font-medium tracking-[-0.16px]">
            비밀번호 확인<span className="auth-required">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPwConfirm ? "text" : "password"}
              value={form.passwordConfirm}
              onChange={(e) => onChange("passwordConfirm", e.target.value)}
              onBlur={() => onFieldBlur("passwordConfirm")}
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              className={`auth-input pl-[12px] pr-[48px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${errors.passwordConfirm ? "!border-fill-danger focus:!border-fill-danger" : ""}`}
            />
            <button
              type="button"
              onClick={onTogglePwConfirm}
              aria-label={showPwConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 표시"}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-text-teritary hover:text-text-primary transition-colors flex items-center justify-center"
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
          <label className="flex cursor-pointer select-none items-center text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-text-teritary">
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={(e) => onChange("agreeTerms", e.target.checked)}
              className="hidden"
            />
            <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center mr-[8px] transition-colors
              ${form.agreeTerms ? "bg-btn-primary border-btn-primary" : "bg-fill-inverse border-border-secondary"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" 
                className={`w-[12px] h-[12px] ${form.agreeTerms ? "text-text-onFill" : "text-transparent"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <span>
              [필수]{" "}
              <a href="#terms" className="underline text-text-secondary ml-[4px]">서비스 이용약관</a> 및{" "}
              <a href="#privacy" className="underline text-text-secondary">개인정보 처리방침</a> 동의
            </span>
          </label>
        </div>

        {/* 5. 다음 제출 버튼 */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`h-[44px] w-full rounded-[12px] px-[20px] text-[16px] font-medium leading-[150%] tracking-[-0.16px] transition-colors
            ${isFormValid ? "bg-btn-primary text-text-onFill hover:brightness-95 cursor-pointer" : "bg-btn-teritary text-text-onFill cursor-not-allowed"}`}
        >
          다음
        </button>
        </form>

        <AuthDivider />

        <SocialAuthButtons
          actionLabel="가입하기"
          onSocialAuth={onSocialSignUp}
        />

        {socialErrorMessage && (
          <AuthErrorMessage className="text-center whitespace-pre-line">
            {socialErrorMessage}
          </AuthErrorMessage>
        )}

        <div className="flex justify-center gap-[8px] text-center text-[16px] font-medium leading-[150%] tracking-[-0.16px]">
          <span className="text-text-teritary">이미 계정이 있으신가요?</span>
          <Link to="/login" className="text-text-strong hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};
