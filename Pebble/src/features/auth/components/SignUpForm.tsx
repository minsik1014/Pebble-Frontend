// @/features/auth/components/SignUpForm.tsx
import React from "react";
import { Link } from "react-router-dom"; // 💡 새로고침 없는 매끄러운 화면 이동을 위해 추가

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
  isFormValid: boolean;
  shakeTarget: { email?: boolean; password?: boolean; passwordConfirm?: boolean }; 
  onChange: (field: string, value: any) => void;
  onFieldBlur: (field: "email" | "password" | "passwordConfirm") => void; 
  onTogglePw: () => void;
  onTogglePwConfirm: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SignUpForm = ({
  form,
  showPw,
  showPwConfirm,
  errors,
  isFormValid,
  shakeTarget,
  onChange,
  onFieldBlur,
  onTogglePw,
  onTogglePwConfirm,
  onSubmit,
}: SignUpFormProps) => {
  return (
    <div className="w-full max-w-[440px] flex flex-col px-[16px] sm:px-0 mx-auto mt-[40px] md:mt-[80px]">
      <h2 className="text-[24px] sm:text-[26px] font-bold text-[#111111] mb-[32px] sm:mb-[40px] tracking-tight text-left">
        Pebble 시작하기
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col w-full">
        {/* 1. 이메일 필드 */}
        <div className={`flex flex-col mb-[20px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
          <label className="text-[14px] font-medium text-[#444444] mb-[8px]">
            이메일<span className="text-[#FF4D4D] ml-[2px]">*</span>
          </label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onFieldBlur("email")}
            placeholder="이메일을 입력해 주세요"
            className={`w-full h-[48px] sm:h-[52px] px-[16px] border rounded-[8px] text-[15px] outline-none transition-all placeholder-[#C5C5C5]
              ${errors.email ? "border-[#FF4D4D] focus:border-[#FF4D4D]" : "border-[#E5E7EB] focus:border-[#111111]"}`}
          />
          {errors.email && (
            <div className="mt-[8px] text-[13px] text-[#FF4D4D] font-medium text-left">{errors.email}</div>
          )}
        </div>

        {/* 2. 비밀번호 필드 */}
        <div className={`flex flex-col mb-[20px] relative ${shakeTarget.password && errors.password ? "animate-shake" : ""}`}>
          <label className="text-[14px] font-medium text-[#444444] mb-[8px]">
            비밀번호<span className="text-[#FF4D4D] ml-[2px]">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              onBlur={() => onFieldBlur("password")}
              placeholder="비밀번호를 입력해 주세요"
              className={`w-full h-[48px] sm:h-[52px] pl-[16px] pr-[48px] border rounded-[8px] text-[15px] outline-none transition-all placeholder-[#C5C5C5]
                ${errors.password ? "border-[#FF4D4D] focus:border-[#FF4D4D]" : "border-[#E5E7EB] focus:border-[#111111]"}`}
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
            <div className="mt-[8px] text-[13px] text-[#FF4D4D] font-medium text-left">{errors.password}</div>
          ) : (
            <div className="mt-[8px] text-[12px] text-[#999999] text-left">8자 이상, 영문·숫자 포함</div>
          )}
        </div>

        {/* 3. 비밀번호 확인 필드 */}
        <div className={`flex flex-col mb-[24px] relative ${shakeTarget.passwordConfirm && errors.passwordConfirm ? "animate-shake" : ""}`}>
          <label className="text-[14px] font-medium text-[#444444] mb-[8px]">
            비밀번호 확인<span className="text-[#FF4D4D] ml-[2px]">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPwConfirm ? "text" : "password"}
              value={form.passwordConfirm}
              onChange={(e) => onChange("passwordConfirm", e.target.value)}
              onBlur={() => onFieldBlur("passwordConfirm")}
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              className={`w-full h-[48px] sm:h-[52px] pl-[16px] pr-[48px] border rounded-[8px] text-[15px] outline-none transition-all placeholder-[#C5C5C5]
                ${errors.passwordConfirm ? "border-[#FF4D4D] focus:border-[#FF4D4D]" : "border-[#E5E7EB] focus:border-[#111111]"}`}
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
            <div className="mt-[8px] text-[13px] text-[#FF4D4D] font-medium text-left">{errors.passwordConfirm}</div>
          )}
        </div>

        {/* 4. 약관 동의 체크박스 영역 */}
        <div className="flex items-center mb-[32px] text-left">
          <label className="flex items-center cursor-pointer select-none text-[14px] text-[#444444]">
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
          className={`w-full h-[48px] sm:h-[52px] text-white font-semibold rounded-[8px] text-[16px] transition-colors mb-[24px]
            ${isFormValid ? "bg-[#111111] hover:bg-[#222222] cursor-pointer" : "bg-[#737373] cursor-not-allowed"}`}
        >
          다음
        </button>
      </form>

      {/* 💡 <a> 태그를 <Link> 컴포넌트로 깔끔하게 변경 완료 */}
      <div className="flex justify-center gap-[6px] text-[14px]">
        <span className="text-[#888888]">이미 계정이 있으신가요?</span>
        <Link to="/login" className="text-[#111111] font-semibold hover:underline">
          로그인
        </Link>
      </div>
    </div>
  );
};