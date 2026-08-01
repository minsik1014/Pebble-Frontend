import eyesIcon from '@/assets/icons/Ic/Ic/Eyes.svg';

/** 로그인 비밀번호 표시 토글에 사용하는 디자인 시스템 눈 아이콘입니다. */
export const EyeIcon = ({ open: _open }: { open: boolean }) => (
  <img
    src={eyesIcon}
    alt=""
    aria-hidden="true"
    className="size-[24px]"
  />
);
