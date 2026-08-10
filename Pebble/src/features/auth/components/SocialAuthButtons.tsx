import google from '@/assets/icons/logo-google.svg';
import naver from '@/assets/icons/logo-naver.svg';

type SocialProvider = 'google' | 'naver';

interface SocialAuthButtonsProps {
  actionLabel: '계속하기' | '가입하기';
  onSocialAuth: (provider: SocialProvider) => void;
}

export const SocialAuthButtons = ({
  actionLabel,
  onSocialAuth,
}: SocialAuthButtonsProps): JSX.Element => {
  return (
    <div className="flex w-full flex-col gap-[12px]">
      <button
        type="button"
        onClick={() => onSocialAuth('google')}
        className="relative flex h-[44px] w-full items-center justify-center rounded-[12px] border border-[#D4D4D4] px-[20px] transition-colors hover:bg-[#FAFAFA]"
      >
        <span className="absolute left-[20px] flex size-[44px] items-center justify-center">
          <img src={google} alt="" className="size-[24px] object-contain" />
        </span>
        <span className="text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-[#171717]">
          Google로 {actionLabel}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSocialAuth('naver')}
        className="relative flex h-[44px] w-full items-center justify-center rounded-[12px] bg-[#03CF5D] px-[20px] transition-colors hover:bg-[#02B953]"
      >
        <span className="absolute left-[20px] flex size-[44px] items-center justify-center">
          <img src={naver} alt="" className="size-[24px] object-contain" />
        </span>
        <span className="text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-white">
          네이버로 {actionLabel}
        </span>
      </button>
    </div>
  );
};
