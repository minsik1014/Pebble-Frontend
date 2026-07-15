export const ProfileEditForm = (): JSX.Element => {
  const inputClassName =
    "h-12 w-full rounded-token-s border border-border-default bg-fill-inverse px-3 text-body-02-m text-text-strong placeholder:text-text-teritary";

  return (
    <form className="mt-12 flex w-[640px] flex-col gap-7">
      <label className="flex flex-col gap-2 text-body-02-sb text-text-strong">
        로그인 ID
        <input
          type="email"
          defaultValue="example1234@sample.com"
          readOnly
          className={`${inputClassName} bg-fill-surface text-text-secondary`}
        />
      </label>

      <label className="flex flex-col gap-2 pt-3 text-body-02-sb text-text-strong">
        닉네임 설정
        <input
          type="text"
          defaultValue="페블이"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-2 pt-3 text-body-02-sb text-text-strong">
        한 줄 소개
        <input
          type="text"
          defaultValue="일상이없는게제일상입니다."
          className={inputClassName}
        />
      </label>

      <button
        type="submit"
        disabled
        className="mt-3 h-12 rounded-token-s bg-btn-secondary text-body-02-m text-text-onFill disabled:cursor-not-allowed disabled:opacity-60"
      >
        저장
      </button>
    </form>
  );
};
