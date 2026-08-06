import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserAddIcon from "@/assets/icons/User-Add.svg?react";
import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import {
  getAllFollows,
  type FollowListItem,
} from "@/features/friends/api/followApi";
import { FOLLOW_UPDATED_EVENT } from "@/features/friends/utils/followSync";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";

const MAX_VISIBLE_FRIENDS = 6;

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { isSidebarOpen } = useCalendarLayoutContext();
  const profile = useProfileStore((state) => state.profile);
  const isProfileLoaded = useProfileStore((state) => state.isLoaded);
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const [friends, setFriends] = useState<FollowListItem[]>([]);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  const loadFriends = useCallback(async () => {
    try {
      const [friendList, pendingRequests] = await Promise.all([
        getAllFollows("friends"),
        getAllFollows("pending"),
      ]);

      setFriends(friendList);
      setPendingRequestCount(pendingRequests.length);
    } catch {
      setFriends([]);
      setPendingRequestCount(0);
    }
  }, []);

  useEffect(() => {
    if (!isProfileLoaded) {
      void loadProfile();
    }
  }, [isProfileLoaded, loadProfile]);

  useEffect(() => {
    void loadFriends();

    window.addEventListener(FOLLOW_UPDATED_EVENT, loadFriends);
    return () => {
      window.removeEventListener(FOLLOW_UPDATED_EVENT, loadFriends);
    };
  }, [loadFriends]);

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <div className="mx-6 mt-6 flex h-[160px] items-center rounded-[20px] bg-fill-inverse px-5 shadow-shadow-m">
        <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
          <div className="flex h-[128px] w-[84px] shrink-0 flex-col items-center rounded-[42px] bg-fill-primary px-2 pt-2 text-text-onFill">
            <ProfileAvatar
              imageUrl={profile.imageUrl}
              nickname={profile.nickname}
              className="size-16 border-2 border-fill-primary"
            />
            <span className="mt-2 max-w-full truncate text-body-02-m">
              {profile.nickname || "내 프로필"}
            </span>
          </div>

          {friends.slice(0, MAX_VISIBLE_FRIENDS).map((friend) => (
            <div
              key={friend.followId}
              className="flex w-[72px] shrink-0 flex-col items-center"
            >
              <ProfileAvatar
                imageUrl={friend.profileImageUrl}
                nickname={friend.nickname}
                className={`size-16 border-[3px] ${
                  friend.hasTodaySchedule
                    ? "border-fill-primary"
                    : "border-border-default"
                }`}
              />
              <span className="mt-2 w-full truncate text-center text-body-02-m text-text-strong">
                {friend.nickname}
              </span>
            </div>
          ))}
        </div>

        <div className="ml-5 flex h-[112px] w-[88px] shrink-0 items-center justify-end border-l border-border-default pl-5">
          <button
            type="button"
            onClick={() => navigate("/friends")}
            className="group relative flex flex-col items-center gap-3 text-text-strong"
            aria-label="친구 페이지로 이동"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-fill-primary text-text-onFill transition-opacity group-hover:opacity-85">
              <UserAddIcon className="size-6" />
            </span>
            {pendingRequestCount > 0 && (
              <span className="absolute right-[-4px] top-[-4px] flex min-w-6 items-center justify-center rounded-full bg-fill-danger px-1.5 text-body-03-r text-text-onFill">
                {pendingRequestCount > 99 ? "99+" : pendingRequestCount}
              </span>
            )}
            <span className="text-body-02-m">친구</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ProfileAvatar({
  imageUrl,
  nickname,
  className,
}: {
  imageUrl: string | null;
  nickname: string;
  className: string;
}): JSX.Element {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-fill-surface text-text-secondary ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${nickname}님의 프로필`}
          className="size-full object-cover"
        />
      ) : (
        <MySolidIcon className="size-10" />
      )}
    </div>
  );
}
