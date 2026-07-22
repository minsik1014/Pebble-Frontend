import React, { useRef } from "react";

interface ProfileOption {
  id: string;
  src: string;
  alt: string;
}

interface ProfileSetupFormProps {
  profiles: ProfileOption[];
  selectedProfileId: string;
  selectedProfileSrc: string;
  nickname: string;
  introduction: string;
  isFormValid: boolean;
  onSelectProfile: (profileId: string) => void;
  onUploadProfile: (file: File) => void;
  onNicknameChange: (value: string) => void;
  onIntroductionChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const ProfileSetupForm = ({
  profiles,
  selectedProfileId,
  selectedProfileSrc,
  nickname,
  introduction,
  isFormValid,
  onSelectProfile,
  onUploadProfile,
  onNicknameChange,
  onIntroductionChange,
  onBack,
  onSubmit,
}: ProfileSetupFormProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[570px] p-[32px] flex flex-col rounded-[20px] bg-white [@media(max-height:850px)]:py-[16px]"
      style={{ fontFamily: "Pretendard, sans-serif" }}
      noValidate
    >
      {/* 뒤로가기와 페이지 제목 */}
      <div className="flex items-center gap-[16px]">
        <button
          type="button"
          onClick={onBack}
          aria-label="회원가입으로 돌아가기"
          className="w-[24px] h-[28px] flex items-center justify-center text-[#404040]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[20px] h-[20px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-[23px] leading-[130%] font-medium tracking-[-0.23px] text-[#404040]">
          프로필을 완성해 주세요
        </h1>
      </div>

      {/* 선택한 프로필 이미지와 프로필 선택 목록 */}
      <div className="mt-[40px] flex flex-col items-center [@media(max-height:850px)]:mt-[16px]">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden border border-[#F5F5F5] bg-white [@media(max-height:850px)]:w-[150px] [@media(max-height:850px)]:h-[150px]">
          <img src={selectedProfileSrc} alt="선택한 프로필 미리보기" className="w-full h-full object-cover" />
        </div>

        <div className="mt-[16px] w-full flex items-center justify-between [@media(max-height:850px)]:mt-[12px]" aria-label="프로필 이미지 선택">
          {profiles.map((profile) => {
            const isSelected = profile.id === selectedProfileId;

            return (
              <button
                key={profile.id}
                type="button"
                aria-label={profile.alt}
                aria-pressed={isSelected}
                onClick={() => onSelectProfile(profile.id)}
                className={`w-[68px] h-[68px] rounded-full overflow-hidden bg-white transition-shadow [@media(max-height:850px)]:w-[56px] [@media(max-height:850px)]:h-[56px] ${
                  isSelected ? "ring-[3px] ring-[#404040] ring-offset-[3px]" : "border border-[#F5F5F5]"
                }`}
              >
                <img src={profile.src} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}

          <button
            type="button"
            aria-label="프로필 이미지 업로드"
            onClick={() => fileInputRef.current?.click()}
            className={`w-[68px] h-[68px] rounded-full border flex items-center justify-center text-[#737373] bg-white [@media(max-height:850px)]:w-[56px] [@media(max-height:850px)]:h-[56px] ${
              selectedProfileId === "upload" ? "border-[#404040] ring-[3px] ring-[#404040] ring-offset-[3px]" : "border-[#D4D4D4]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[24px] h-[24px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3.75m0 0 4.5 4.5M12 3.75l-4.5 4.5M3.75 15v3.75A2.25 2.25 0 0 0 6 21h12a2.25 2.25 0 0 0 2.25-2.25V15" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUploadProfile(file);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      {/* 닉네임은 필수이고 소개는 선택 입력입니다. */}
      <div className="mt-[40px] flex flex-col [@media(max-height:850px)]:mt-[20px]">
        <label htmlFor="profile-nickname" className="text-[15px] leading-[150%] font-normal tracking-[-0.15px] text-[#737373] mb-[8px]">
          닉네임<span className="text-[#FC4C46] ml-[2px]">*</span>
        </label>
        <input
          id="profile-nickname"
          type="text"
          value={nickname}
          onChange={(event) => onNicknameChange(event.target.value)}
          placeholder="닉네임을 입력해 주세요"
          className="w-full h-[52px] px-[16px] border border-[#D4D4D4] rounded-[12px] text-[16px] leading-[24px] font-medium tracking-[-0.16px] outline-none focus:border-[#171717] placeholder:text-[15px] placeholder:font-normal placeholder:tracking-[-0.16px] placeholder:text-[#D4D4D4]"
        />
      </div>

      <div className="mt-[20px] flex flex-col [@media(max-height:850px)]:mt-[12px]">
        <label htmlFor="profile-introduction" className="text-[15px] leading-[150%] font-normal tracking-[-0.15px] text-[#737373] mb-[8px]">
          소개 (선택)
        </label>
        <input
          id="profile-introduction"
          type="text"
          value={introduction}
          onChange={(event) => onIntroductionChange(event.target.value)}
          placeholder="소개를 입력해 주세요"
          className="w-full h-[52px] px-[16px] border border-[#D4D4D4] rounded-[12px] text-[16px] leading-[24px] font-medium tracking-[-0.16px] outline-none focus:border-[#171717] placeholder:text-[15px] placeholder:font-normal placeholder:tracking-[-0.16px] placeholder:text-[#D4D4D4]"
        />
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={`mt-[40px] w-full h-[52px] rounded-[8px] text-[16px] text-white transition-colors [@media(max-height:850px)]:mt-[20px] ${
          isFormValid ? "bg-[#171717] hover:bg-[#262626] cursor-pointer" : "bg-[#858585] cursor-not-allowed"
        }`}
      >
        시작하기
      </button>

      <p className="mt-[24px] text-center text-[13px] leading-[20px] text-[#A3A3A3] [@media(max-height:850px)]:mt-[12px]">
        프로필 이미지와 닉네임, 소개는 마이페이지에서 언제든 수정할 수 있어요
      </p>
    </form>
  );
};
