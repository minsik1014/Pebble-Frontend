import FriendIcon from "@/assets/icons/friend1.svg?react";
import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import type { FollowListItem } from "@/features/friends/api/followApi";
import type { Profile } from "@/features/mypage/types/profile";

type HomeProfileStripProps = {
  profile: Profile;
  friends: FollowListItem[];
  pendingCount: number;
  selectedUserId: number | null;
  isMyCalendarSelected: boolean;
  viewedFriendIds: Set<number>;
  onOpenMyCalendar: () => void;
  onOpenFriends: () => void;
  onOpenFriendCalendar: (friend: FollowListItem) => void;
};

type ProfileImageProps = {
  imageUrl: string | null;
  name: string;
  className?: string;
};

const ProfileImage = ({
  imageUrl,
  name,
  className = "",
}: ProfileImageProps): JSX.Element => (
  <span
    className={`relative flex size-[54px] shrink-0 items-center justify-center overflow-hidden rounded-token-infinite border-[0.5px] border-border-default bg-fill-teritory ${className}`}
  >
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={`${name}님의 프로필`}
        className="size-full object-cover"
      />
    ) : (
      <MySolidIcon className="size-7 text-text-secondary" aria-hidden="true" />
    )}
  </span>
);

const getProfileButtonClassName = (isSelected: boolean) =>
  [
    "flex shrink-0 flex-col items-center justify-center gap-token-xs rounded-token-infinite px-token-s py-token-m transition-colors",
    isSelected
      ? "bg-btn-primary text-text-onFill"
      : "text-text-strong hover:bg-fill-surface",
  ].join(" ");

export const HomeProfileStrip = ({
  profile,
  friends,
  pendingCount,
  selectedUserId,
  isMyCalendarSelected,
  viewedFriendIds,
  onOpenMyCalendar,
  onOpenFriends,
  onOpenFriendCalendar,
}: HomeProfileStripProps): JSX.Element => (
    <section className="flex h-[149px] w-full items-center justify-between rounded-token-m bg-fill-inverse p-token-l shadow-shadow-m">
      <div className="flex h-full min-w-0 flex-1 items-center gap-token-xl border-r border-border-teritory pr-token-l">
        <button
          type="button"
          onClick={onOpenMyCalendar}
          className={getProfileButtonClassName(isMyCalendarSelected)}
          aria-pressed={isMyCalendarSelected}
        >
          <span className="flex flex-col items-center gap-token-s">
            <ProfileImage imageUrl={profile.imageUrl} name={profile.nickname} />
            <span className="max-w-[54px] truncate text-body-01-m text-current">
              {profile.nickname || "나"}
            </span>
          </span>
        </button>

        <div className="-my-2 min-w-0 flex-1 overflow-x-auto overflow-y-hidden py-2 custom-scrollbar">
          <div className="flex w-max items-center gap-token-m py-1">
            {friends.map((friend) => {
              const isSelected = selectedUserId === friend.userId;
              const shouldShowStoryRing =
                friend.hasTodaySchedule && !viewedFriendIds.has(friend.userId);

              return (
                <button
                  type="button"
                  key={friend.followId}
                  onClick={() => onOpenFriendCalendar(friend)}
                  className={getProfileButtonClassName(isSelected)}
                  aria-label={`${friend.nickname}님의 공개 캘린더 보기`}
                  aria-pressed={isSelected}
                >
                  <span className="relative flex size-[64px] items-center justify-center">
                    {shouldShowStoryRing && (
                      <span
                        className="absolute inset-0 rounded-token-infinite border-[3px] border-text-strong"
                        aria-hidden="true"
                      />
                    )}
                    <ProfileImage
                      imageUrl={friend.profileImageUrl}
                      name={friend.nickname}
                    />
                  </span>
                  <span className="max-w-[54px] truncate text-body-01-m text-current">
                    {friend.nickname}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenFriends}
        className="relative ml-token-l flex shrink-0 flex-col items-center gap-token-xs rounded-token-infinite px-token-s py-token-m text-text-strong"
      >
        <span className="relative flex size-[54px] items-center justify-center">
          <FriendIcon className="size-[54px] text-fill-primary" aria-hidden="true" />
          {pendingCount > 0 && (
            <>
              <span
                className="absolute left-[42px] top-[10px] size-[22px] rounded-token-infinite bg-fill-inverse"
                aria-hidden="true"
              />
              <span className="absolute left-[44px] top-[12px] flex size-[18px] items-center justify-center rounded-token-infinite bg-fill-danger text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-text-onFill">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            </>
          )}
        </span>
        <span className="text-body-01-m">친구</span>
      </button>
    </section>
);
