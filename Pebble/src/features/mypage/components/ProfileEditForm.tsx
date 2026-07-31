import { useEffect, useState, type FormEvent } from "react";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const ProfileEditForm = (): JSX.Element => {
  const profile = useProfileStore((state) => state.profile);
  const hasPendingImage = useProfileStore(
    (state) => state.pendingImageUrl !== null,
  );
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const isSaving = useProfileStore((state) => state.isSaving);
  const error = useProfileStore((state) => state.error);
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const [isToastMounted, setIsToastMounted] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const nicknameAvailableAt = profile.nicknameChangeableAfter
    ? new Date(profile.nicknameChangeableAfter).getTime()
    : 0;
  const remainingDays = Math.max(
    0,
    Math.ceil((nicknameAvailableAt - Date.now()) / DAY_IN_MS),
  );
  const isNicknameLocked = remainingDays > 0;

  const normalizedNickname = nickname.trim();
  const normalizedBio = bio.trim();
  const hasChanges =
    normalizedNickname !== profile.nickname ||
    normalizedBio !== profile.bio ||
    hasPendingImage;
  const canSave = normalizedNickname.length > 0 && hasChanges && !isSaving;

  useEffect(() => {
    setNickname(profile.nickname);
    setBio(profile.bio);
  }, [profile.nickname, profile.bio]);

  useEffect(() => {
    if (!isToastMounted) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setIsToastVisible(true);
    }, 150);
    const hideTimer = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 2150);
    const removeTimer = window.setTimeout(() => {
      setIsToastMounted(false);
    }, 2600);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [isToastMounted]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    const nicknameChanged = normalizedNickname !== profile.nickname;
    const bioChanged = normalizedBio !== profile.bio;

    try {
      await updateProfile({
        nickname: normalizedNickname,
        bio: normalizedBio,
      });
      setNickname(normalizedNickname);
      setBio(normalizedBio);
    } catch {
      return;
    }

    if (nicknameChanged) {
      setToastMessage(
        "닉네임이 변경되었어요. 15일 후에 다시 변경할 수 있어요.",
      );
    } else if (hasPendingImage) {
      setToastMessage("프로필 이미지가 변경되었어요.");
    } else if (bioChanged) {
      setToastMessage("한 줄 소개가 변경되었어요.");
    }

    setIsToastMounted(true);
  };

  const inputClassName =
    "h-12 w-full rounded-token-s border border-border-default bg-fill-inverse px-3 text-body-02-m text-text-strong placeholder:text-text-teritary";

  return (
    <form
      className="mt-12 flex w-[640px] flex-col gap-7"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-2 text-body-02-sb text-text-strong">
        로그인 ID
        <input
          type="email"
          value={profile.email}
          readOnly
          className={`${inputClassName} bg-fill-surface text-text-secondary`}
        />
      </label>

      <label className="relative flex flex-col gap-2 pt-3 text-body-02-sb text-text-strong">
        닉네임 설정
        <input
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          disabled={isNicknameLocked}
          maxLength={20}
          className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-fill-surface disabled:text-text-secondary`}
        />
        {isNicknameLocked && (
          <span className="absolute left-0 top-full mt-1 text-body-03-r text-fill-danger">
            {remainingDays}일 후 변경 가능해요
          </span>
        )}
      </label>

      <label className="flex flex-col gap-2 pt-3 text-body-02-sb text-text-strong">
        한 줄 소개
        <input
          type="text"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          maxLength={50}
          className={inputClassName}
        />
      </label>

      <button
        type="submit"
        disabled={!canSave}
        className="mt-3 h-12 rounded-token-s bg-btn-secondary text-body-02-m text-text-onFill transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "저장 중..." : "저장"}
      </button>

      {error && (
        <p role="alert" className="-mt-4 text-body-03-r text-fill-danger">
          {error}
        </p>
      )}

      {isToastMounted && (
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute bottom-4 right-5 z-30 rounded-[16px] bg-black px-5 py-3 text-[14px] font-medium leading-5 text-white shadow-lg transition-all duration-[450ms] ease-in-out ${
            isToastVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </form>
  );
};
