import type { SharedFriend, SharedFriends } from '../types/report';
import { EmptyState } from '../components/EmptyState';
import defaultProfile from '@/assets/profiles/profile1.png';

interface SharedFriendsSectionProps {
  /** 서버 값: sharedFriends */
  sharedFriends: SharedFriends;
  /** 서버 값: reportMonth — 제목 "6월의 친구들이에요" */
  month: number;
}

/** 친구 한 줄 */
function FriendRow({ friend }: { friend: SharedFriend }) {
  const avatarSrc = friend.avatarUrl || defaultProfile;

  return (
    <li className="flex h-[56px] items-center overflow-hidden rounded-[12px] bg-white p-[8px]">
      {/* 프로필 이미지 — 서버 값(avatarUrl).
          crossOrigin 이 있어야 R007 이미지 저장에서 아바타가 함께 구워집니다.
          CDN 이 Access-Control-Allow-Origin 을 내려주지 않으면 빈 칸으로 저장됩니다. */}
      <img
        src={avatarSrc}
        alt={`${friend.nickname} 프로필`}
        crossOrigin={friend.avatarUrl ? 'anonymous' : undefined}
        className="h-[40px] w-[40px] shrink-0 rounded-full border-[0.5px] border-[#D4D4D4] object-cover"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = defaultProfile;
        }}
      />

      <span className="ml-[12px] flex min-w-0 flex-1 flex-col justify-center leading-[150%]">
        {/* 공유 카테고리 이름 — 서버 값(categoryName) */}
        {friend.categoryName && (
          <span className="truncate text-[14px] font-medium tracking-[-0.14px] text-[#A3A3A3]">
            {friend.categoryName}
          </span>
        )}
        {/* 닉네임 — 서버 값(nickname) */}
        <span className="truncate text-[18px] font-medium tracking-[-0.18px] text-[#171717]">
          {friend.nickname}
        </span>
      </span>
    </li>
  );
}

/** R006 — 공유 카테고리를 함께한 친구들 */
export function SharedFriendsSection({
  sharedFriends,
  month,
}: SharedFriendsSectionProps) {
  const { sharedCategoryCount, friends } = sharedFriends;

  return (
    <div className="flex h-full w-full flex-col gap-[20px]">
      <div className="flex flex-col gap-[8px]">
        <p className="text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3]">
          공유 카테고리를 함께한
        </p>

        {/* 월 — 서버 값(reportMonth) */}
        <h2 className="text-[40px] font-bold leading-[150%] tracking-[-0.4px] text-[#404040]">
          {month}월의 친구들이에요
        </h2>
      </div>

      {/* 공유 카테고리 수 — 서버 값(sharedCategoryCount) */}
      <p className="flex h-[40px] w-full items-center rounded-[999px] bg-[#FAFAFA] px-[20px] text-[16px] font-semibold leading-[150%] tracking-[-0.16px] text-[#A3A3A3]">
        공유 카테고리 {sharedCategoryCount.toLocaleString('ko-KR')}개
      </p>

      {friends.length === 0 ? (
        <EmptyState
          className="flex-1"
          message="저번 달에는 함께한 친구가 없어요."
        />
      ) : (
        <ul className="flex flex-col gap-[12px]">
          {friends.map((friend) => (
            <FriendRow key={friend.id} friend={friend} />
          ))}
        </ul>
      )}
    </div>
  );
}
