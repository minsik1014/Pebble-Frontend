// @/features/auth/components/LoginForm.tsx
import React from "react";
import google from "@/assets/icons/logo-google.svg"; 
import naver from "@/assets/icons/logo-naver.svg"; 
import { Link } from "react-router-dom";
import { AuthErrorMessage } from "./AuthErrorMessage";

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-[22px] h-[22px] flex-shrink-0"
  >
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

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  errorMessage: string | null; 
  errors: {                    
    email?: string;
    password?: string;
  };
  shakeTarget: { email?: boolean; password?: boolean };
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFieldBlur: (field: "email" | "password") => void; 
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialLogin: (provider: "google" | "naver") => void;
}

export const LoginForm = ({
  email,
  password,
  showPassword,
  errorMessage, 
  errors, 
  shakeTarget,
  onEmailChange,
  onPasswordChange,
  onFieldBlur, 
  onTogglePassword,
  onSubmit,
  onSocialLogin,
}: LoginFormProps) => {
  return (
    <div className="w-full md:w-[506px] flex flex-col px-[4px] sm:px-0" data-id="login-form-section">
      <h2 className="auth-title mb-[36px] text-center sm:text-left">
        로그인
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col w-full" noValidate>
        {/* 이메일 섹션 */}
        {/* shakeTarget 유무에 따라 animate-shake 클래스 부여 */}
        <div className={`flex flex-col mb-[16px] sm:mb-[20px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px]">
            이메일<span className="auth-required">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => onFieldBlur("email")} 
            placeholder="이메일을 입력해 주세요"
            className={`auth-input px-[12px]
              ${(errors?.email || errorMessage) ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
          />
          {errors?.email && (
            <AuthErrorMessage className="mt-[8px]">{errors.email}</AuthErrorMessage>
          )}
        </div>

        {/* 비밀번호 섹션 */}
        {/* shakeTarget 유무에 따라 animate-shake 클래스 부여 */}
        <div className={`flex flex-col relative ${errors?.password || errorMessage ? 'mb-0' : 'mb-[16px]'} ${shakeTarget.password && errors.password ? "animate-shake" : ""}`}>
          <label className="auth-label mb-[8px]">
            비밀번호<span className="auth-required">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onBlur={() => onFieldBlur("password")} 
              placeholder="비밀번호를 입력해 주세요"
              className={`auth-input pl-[12px] pr-[48px]
                ${(errors?.password || errorMessage) ? "!border-[#FC4C46] focus:!border-[#FC4C46]" : ""}`}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444] transition-colors flex items-center justify-center"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors?.password && (
            <AuthErrorMessage className="mt-[8px]">{errors.password}</AuthErrorMessage>
          )}
        </div>

        {/* 로그인 실패 / 서버 에러 메시지 */}
        {errorMessage && (
          <AuthErrorMessage className="mt-[12px] leading-[1.6] break-keep whitespace-pre-line">
            {errorMessage}
          </AuthErrorMessage>
        )}

        {/* 비밀번호 찾기 */}
        <div className={`flex justify-end ${(errors?.password || errorMessage) ? 'mt-[16px]' : 'mt-0'} mb-[24px]`}>
          <Link to="/forgot-password" className="auth-body text-[#A3A3A3] hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full h-[52px] bg-[#171717] text-white rounded-[12px] auth-body hover:bg-[#262626] transition-colors mb-[20px] sm:mb-[28px]"
        >
          로그인
        </button>
      </form>

      {/* 구분선 */}
      <div className="flex items-center my-[8px] w-full">
        <div className="flex-1 h-[1px] bg-[#E5E7EB]"></div>
        <span className="px-[12px] text-[13px] font-normal text-[#A3A3A3]">또는</span>
        <div className="flex-1 h-[1px] bg-[#E5E7EB]"></div>
      </div>

      {/* 소셜 로그인 버튼 세트 */}
      <div className="flex flex-col gap-[12px] mt-[16px] w-full">
        <button
          type="button"
          onClick={() => onSocialLogin("google")}
          className="w-full h-[52px] border border-[#D4D4D4] rounded-[12px] flex items-center justify-center relative hover:bg-[#FAFAFA] transition-colors"
        >
          <img src={google} alt="Google" className="absolute left-[20px] w-[20px] h-[20px] flex-shrink-0 object-contain aspect-square" />
          <span className="auth-body text-[#171717]">Google로 계속하기</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialLogin("naver")}
          className="w-full h-[52px] bg-[#03C75A] rounded-[12px] flex items-center justify-center relative hover:bg-[#02b34f] transition-colors"
        >
          <img src={naver} alt="Naver" className="absolute left-[20px] w-[18px] h-[18px] flex-shrink-0 object-contain aspect-square" />
          <span className="auth-body text-white">네이버로 계속하기</span>
        </button>
      </div>

      {/* 하단 회원가입 유도 */}
      <div className="auth-body flex justify-center gap-[8px] mt-[40px]">
        <span className="text-[#A3A3A3]">Pebble이 처음이신가요?</span>
        <Link to="/signup" className="text-[#171717] hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
};
