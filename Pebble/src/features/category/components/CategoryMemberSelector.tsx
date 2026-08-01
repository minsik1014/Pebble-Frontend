import type { Friend } from "@/features/category/types";

type CategoryMemberSelectorProps = {
  selectedMembers: Friend[];
  filteredFriends: Friend[];
  searchQuery: string;
  isDropdownOpen: boolean;
  showSelectedMembersInInput?: boolean;
  onSearchChange: (query: string) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
  onToggleMember: (member: Friend) => void;
};

export const CategoryMemberSelector = ({
  selectedMembers,
  filteredFriends,
  searchQuery,
  isDropdownOpen,
  showSelectedMembersInInput = true,
  onSearchChange,
  onDropdownOpenChange,
  onToggleMember,
}: CategoryMemberSelectorProps) => (
  <div className="relative flex w-full flex-col gap-2">
    <div
      className={[
        "flex min-h-12 w-full flex-wrap items-center gap-token-m rounded-token-s border px-token-l py-token-m",
        selectedMembers.length > 0
          ? "border-border-secondary bg-fill-surface"
          : searchQuery
            ? "border-border-primary bg-fill-inverse"
            : isDropdownOpen
              ? "border-border-primary bg-fill-inverse"
              : "border-border-secondary bg-fill-surface",
      ].join(" ")}
    >
      {showSelectedMembersInInput && selectedMembers.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-token-m rounded-token-infinite bg-fill-teritory p-token-s shadow-shadow-s"
        >
          <div className="flex items-center gap-token-s">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt=""
                className="size-9 shrink-0 rounded-token-infinite border border-border-secondary object-cover"
              />
            ) : (
              <div className="size-9 shrink-0 rounded-token-infinite border border-border-secondary bg-border-default" />
            )}
            <span className="text-body-01-m tracking-[-0.18px] text-text-strong">
              {member.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onToggleMember(member)}
            className="flex size-9 items-center justify-center rounded-token-s text-text-secondary transition-colors hover:bg-black/5"
            aria-label={`${member.name} 구성원 제거`}
          >
            <span className="text-title-03-m leading-none" aria-hidden="true">
              ×
            </span>
          </button>
        </div>
      ))}

      <div className="relative min-w-[220px] flex-1">
        <input
          type="text"
          placeholder="닉네임 또는 이메일을 입력해 주세요"
          className="w-full bg-transparent text-body-02-m text-text-primary outline-none placeholder:text-text-quaternary"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={() => onDropdownOpenChange(true)}
          onBlur={() => setTimeout(() => onDropdownOpenChange(false), 200)}
        />
      </div>
    </div>

    {isDropdownOpen && filteredFriends.length > 0 && (
      <div className="absolute top-full z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-token-s border border-border-secondary bg-fill-inverse shadow-shadow-m">
        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex w-full items-center justify-between overflow-hidden rounded-token-m p-token-m transition-colors hover:bg-btn-pressed"
          >
            <button
              type="button"
              onClick={() => onToggleMember(friend)}
              className="flex min-w-0 flex-1 items-center gap-5 pr-token-l text-left"
            >
              {friend.profileImageUrl ? (
                <img
                  src={friend.profileImageUrl}
                  alt=""
                  className="size-16 shrink-0 rounded-token-infinite border border-border-teritory object-cover"
                />
              ) : (
                <div className="size-16 shrink-0 rounded-token-infinite border border-border-teritory bg-border-default" />
              )}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body-01-sb tracking-[-0.18px] text-text-strong">
                  {friend.name}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onToggleMember(friend)}
              className="flex h-12 shrink-0 items-center justify-center rounded-token-s bg-btn-primary px-token-xl py-token-m text-body-02-m tracking-[-0.16px] text-text-onFill transition-colors hover:brightness-95"
              aria-label={`${friend.name} 구성원 추가`}
            >
              추가
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);
