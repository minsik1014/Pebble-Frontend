// @/features/auth/components/ForgotPasswordForm.tsx
import React from "react";
import { Link } from "react-router-dom";

// 이미지 에셋 임포트 (기존 경로 유지)
import pebble01 from "@/assets/icons/pebble01.png";
import pebble02 from "@/assets/icons/pebble02.png";
import pebble03 from "@/assets/icons/pebble03.png";

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

const PebbleLogo = () => (
  <div className="flex items-center gap-[8px] cursor-pointer">
    <div className="w-[24px] h-[24px] bg-[#111111] rounded-[6px] flex items-center justify-center">
      <span className="text-white text-[12px] font-bold">P</span>
    </div>
    <span className="text-[18px] font-bold text-[#111111] tracking-tight">Pebble</span>
  </div>
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
    <div className="w-full min-h-screen bg-white flex flex-col relative overflow-hidden">
      
      {/* 💡 제공해주신 레퍼런스 구도 완벽 반영: 전체 화면 우측 하단 중심 배경 조약돌 레이아웃 */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* pebble01: 가장 좌측 하단에 은은하게 배치 */}
        <img 
          src={pebble01} 
          alt="Background Pebble 01" 
          className="absolute bottom-[-5%] right-[40%] w-[320px] md:w-[420px] object-contain opacity-0 animate-fade-up" 
          style={{ "--animation-delay": "0ms" } as React.CSSProperties}
        />
        {/* pebble02: 중앙 하단에 크게 안착 */}
        <img 
          src={pebble02} 
          alt="Background Pebble 02" 
          className="absolute bottom-[-8%] right-[10%] w-[440px] md:w-[580px] object-contain opacity-0 animate-fade-up" 
          style={{ "--animation-delay": "200ms" } as React.CSSProperties}
        />
        {/* pebble03: 우측 화면 밖으로 크게 잘려나가는 조약돌 */}
        <img 
          src={pebble03} 
          alt="Background Pebble 03" 
          className="absolute bottom-[10%] right-[-15%] w-[400px] md:w-[520px] object-contain opacity-0 animate-fade-up" 
          style={{ "--animation-delay": "400ms" } as React.CSSProperties}
        />
      </div>

      {/* 상단 GNB 헤더 영역 */}
      <header className="w-full h-[64px] px-[20px] md:px-[40px] flex items-center justify-between border-b border-[#F3F4F6] relative z-10 bg-white">
        <Link to="/">
          <PebbleLogo />
        </Link>
        <div className="flex items-center gap-[16px]">
          <Link to="/signup" className="text-[14px] font-medium text-[#444444] hover:text-[#111111]">회원가입</Link>
          <Link to="/login" className="px-[16px] h-[36px] bg-[#111111] text-white text-[14px] font-medium rounded-[6px] flex items-center justify-center hover:bg-[#222222] transition-colors">로그인</Link>
        </div>
      </header>

      {/* 메인 폼 영역 (배경 조약돌을 가리지 않도록 투명 처리) */}
      <main className="flex-1 flex flex-col justify-center items-center py-[40px] md:py-[60px] px-[16px] relative z-10 bg-transparent">
        <div className="w-full max-w-[440px] flex flex-col">
          
          {/* 뒤로가기 및 타이틀 */}
          <div className="flex items-center mb-[8px] relative">
            <button type="button" onClick={onBackToLogin} className="absolute left-0 text-[#444444] hover:text-[#111111] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[20px] h-[20px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#111111] tracking-tight mx-auto pl-[20px]">
              {step === 1 && "비밀번호를 잊으셨나요?"}
              {step === 2 && "임시 비밀번호 발송 완료"}
              {step === 3 && "비밀번호 변경"}
            </h2>
          </div>

          <p className="text-[14px] text-[#222222] text-center mt-[4px] mb-[32px] sm:mb-[40px] tracking-tight whitespace-pre-line">
            {step === 1 && "가입하신 이메일로 임시 비밀번호를 보내드릴게요"}
            {step === 2 && "로그인 후 비밀번호를 변경해 주세요"}
            {step === 3 && `임시 비밀번호로 로그인되었어요\n새 비밀번호를 설정해 주세요`}
          </p>

          <form onSubmit={onSubmit} className="flex flex-col w-full text-left" noValidate>
            
            {/* STEP 1: 이메일 입력 단계 */}
            {step === 1 && (
              <div className={`flex flex-col mb-[32px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
                <label className="text-[14px] font-medium text-[#444444] mb-[8px]">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onChange("email", e.target.value)}
                  onBlur={() => onFieldBlur("email")}
                  placeholder="이메일을 입력해 주세요"
                  className="w-full h-[48px] sm:h-[52px] px-[16px] border rounded-[8px] text-[15px] outline-none transition-all placeholder-[#C5C5C5] bg-white border-[#E5E7EB] focus:border-[#111111]"
                />
                {errors.email && (
                  <div className="mt-[8px] text-[13px] text-[#FF4D4D] font-medium text-left">{errors.email}</div>
                )}
              </div>
            )}

            {/* STEP 2: 발송 완료 단계 */}
            {step === 2 && (
              <div className="flex flex-col items-center mb-[32px] w-full">
                <div className="w-full bg-white/90 backdrop-blur-[4px] border border-[#E5E7EB] rounded-[12px] p-[20px] flex items-start gap-[12px]">
                  <div className="w-[36px] h-[36px] rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] text-[#666666]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[15px] font-bold text-[#111111]">{email || "sample@sample.com"} <span className="font-normal text-[#666666]">으로</span></span>
                    <span className="text-[13px] text-[#666666] mt-[2px]">임시 비밀번호를 전송했어요</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: 비밀번호 설정 변경 단계 */}
            {step === 3 && (
              <>
                {/* 새 비밀번호 */}
                <div className={`flex flex-col mb-[20px] relative ${shakeTarget.newPassword && errors.newPassword ? "animate-shake" : ""}`}>
                  <label className="text-[14px] font-medium text-[#444444] mb-[8px]">새 비밀번호<span className="text-[#FF4D4D] ml-[2px]">*</span></label>
                  <div className="relative w-full">
                    <input
                      type={showPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => onChange("newPassword", e.target.value)}
                      onBlur={() => onFieldBlur("newPassword")}
                      placeholder="비밀번호를 입력해 주세요"
                      className="w-full h-[48px] sm:h-[52px] pl-[16px] pr-[48px] border rounded-[8px] text-[15px] outline-none transition-all placeholder-[#C5C5C5] bg-white border-[#E5E7EB] focus:border-[#111111]"
                    />
                    <button type="button" onClick={onTogglePw} className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444] flex items-center justify-center">
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {errors.newPassword ? (
                    <div className="mt-[8px] text-[13px] text-[#FF4D4D] font-medium text-left">{errors.newPassword}</div>
                  ) : (
                    <div className="mt-[8px] text-[12px] text-[#999999] text-left">8자 이상, 영문·숫자 포함</div>
                  )}
                </div>

                {/* 새 비밀번호 확인 */}
                <div className={`flex flex-col mb-[32px] relative ${shakeTarget.passwordConfirm && errors.passwordConfirm ? "animate-shake" : ""}`}>
                  <label className="text-[14px] font-medium text-[#444444] mb-[8px]">새 비밀번호 확인<span className="text-[#FF4D4D] ml-[2px]">*</span></label>
                  <div className="relative w-full">
                    <input
                      type={showPwConfirm ? "text" : "password"}
                      value={passwordConfirm}
                      onChange={(e) => onChange("passwordConfirm", e.target.value)}
                      onBlur={() => onFieldBlur("passwordConfirm")}
                      placeholder="비밀번호를 한 번 더 입력해 주세요"
                      className="w-full h-[48px] sm:h-[52px] pl-[16px] pr-[48px] border rounded-[8px] text-[15px] outline-none transition-all placeholder-[#C5C5C5] bg-white border-[#E5E7EB] focus:border-[#111111]"
                    />
                    <button type="button" onClick={onTogglePwConfirm} className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444] flex items-center justify-center">
                      <EyeIcon open={showPwConfirm} />
                    </button>
                  </div>
                  {errors.passwordConfirm && (
                    <div className="mt-[8px] text-[13px] text-[#FF4D4D] font-medium text-left">{errors.passwordConfirm}</div>
                  )}
                </div>
              </>
            )}

            {/* 하단 공통 제출 버튼 */}
            <button
              type="submit"
              disabled={step !== 2 && !isFormValid}
              className={`w-full h-[48px] sm:h-[52px] text-white font-semibold rounded-[8px] text-[16px] transition-colors
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