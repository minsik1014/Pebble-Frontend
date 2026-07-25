import type { Friend } from "@/features/category/types";

type CategoryMemberSelectorProps = {
  selectedMembers: Friend[];
  filteredFriends: Friend[];
  searchQuery: string;
  isDropdownOpen: boolean;
  onSearchChange: (query: string) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
  onToggleMember: (member: Friend) => void;
};

export const CategoryMemberSelector = ({
  selectedMembers,
  filteredFriends,
  searchQuery,
  isDropdownOpen,
  onSearchChange,
  onDropdownOpenChange,
  onToggleMember,
}: CategoryMemberSelectorProps) => (
  <div className="flex flex-col gap-2 w-full relative">
    <h3 className="font-semibold text-[18px] text-text-primary leading-[1.5] tracking-[-0.18px]">
      구성원
    </h3>
    <div className="bg-fill-surface border border-border-default flex gap-3 items-center px-5 py-3 rounded-token-s w-full flex-wrap">
      {selectedMembers.map((member) => (
        <div key={member.id} className="bg-[#e5e5e5] drop-shadow-sm flex gap-3 items-center p-2 rounded-full">
          <div className="flex gap-2 items-center">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt=""
                className="h-9 w-9 flex-shrink-0 rounded-full border border-border-default object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-300 border border-border-default flex-shrink-0" />
            )}
            <span className="font-medium text-[18px] text-text-strong tracking-[-0.18px]">
              {member.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onToggleMember(member)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#737373" />
            </svg>
          </button>
        </div>
      ))}

      <div className="relative flex-1 min-w-[150px]">
        <input
          type="text"
          placeholder="친구 추가..."
          className="w-full bg-transparent outline-none text-[16px] text-text-primary placeholder:text-text-teritary"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={() => onDropdownOpenChange(true)}
          onBlur={() => setTimeout(() => onDropdownOpenChange(false), 200)}
        />
      </div>
    </div>

    {isDropdownOpen && filteredFriends.length > 0 && (
      <div className="absolute top-full mt-2 w-full bg-fill-inverse border border-border-default rounded-token-s shadow-shadow-m max-h-48 overflow-y-auto z-10">
        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => onToggleMember(friend)}
            className="flex gap-3 items-center px-4 py-3 hover:bg-fill-surface cursor-pointer transition-colors"
          >
            {friend.profileImageUrl ? (
              <img
                src={friend.profileImageUrl}
                alt=""
                className="h-9 w-9 flex-shrink-0 rounded-full border border-border-default object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-300 border border-border-default flex-shrink-0" />
            )}
            <span className="font-medium text-[16px] text-text-primary">{friend.name}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
