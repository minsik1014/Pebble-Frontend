import React, { useState } from "react";
import UploadIcon from "@/assets/icons/Upload.svg?react";
import { type Category } from "@/types";

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  category?: Category;
  onClose: () => void;
  onRequestDelete?: () => void;
};

const COLORS = [
  "bg-theme-1-base",
  "bg-theme-2-base",
  "bg-theme-3-base",
  "bg-theme-4-base",
  "bg-theme-5-base",
  "bg-theme-6-base",
];

type Friend = { id: number; name: string };
const DUMMY_FRIENDS: Friend[] = [
  { id: 1, name: "담검이" },
  { id: 2, name: "조료" },
  { id: 3, name: "민식이" },
  { id: 4, name: "페블이" },
  { id: 5, name: "짱구" },
];

export const CategoryFormModal = ({ 
  isOpen, 
  mode = "create", 
  category,
  onClose,
  onRequestDelete 
}: CategoryFormModalProps) => {
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [categoryName, setCategoryName] = useState(category?.title || "");

  const [selectedMembers, setSelectedMembers] = useState<Friend[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = DUMMY_FRIENDS.filter((friend) => 
    friend.name.includes(searchQuery) && !selectedMembers.some(m => m.id === friend.id)
  );

  const toggleMember = (member: Friend) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.id === member.id)) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        setSearchQuery(""); // Clear search after adding
        return [...prev, member];
      }
    });
  };

  // Update input when category prop changes
  React.useEffect(() => {
    if (mode === "edit" && category) {
      setCategoryName(category.title);
      // We could also set selectedColor etc. here based on category if needed
      // Mocking edit mode data for now since we don't have real data in category
      setIsShared(true);
      setSelectedMembers([DUMMY_FRIENDS[0], DUMMY_FRIENDS[1]]);
    } else {
      setCategoryName("");
      setSelectedColor(null);
      setIsPublic(false);
      setIsCompleted(false);
      setIsShared(false);
      setSelectedMembers([]);
      setSearchQuery("");
      setIsDropdownOpen(false);
    }
  }, [mode, category, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[676px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-10 shadow-shadow-m relative">
        <header className="flex items-center justify-between">
          <h2 className="text-heading-02 text-text-strong">
            {mode === "create" ? "카테고리 추가하기" : "카테고리 편집"}
          </h2>
        </header>

        <div className="flex items-start gap-10">
          {/* 좌측: 썸네일 업로드 */}
          <div className="w-60 h-96 flex flex-col items-start gap-2">
            <label className="text-body-01-sb text-text-primary">
              대표 이미지 (선택)
            </label>
            <button 
              type="button"
              className="w-full flex-1 flex flex-col items-center justify-center gap-2 bg-fill-surface rounded-token-s border border-border-default hover:bg-fill-surface-hover transition-colors overflow-hidden"
            >
              <UploadIcon className="w-10 h-10 text-text-secondary" />
              <span className="text-body-02-m text-text-secondary">이미지 추가</span>
            </button>
            <span className="w-full text-left text-xs text-text-teritary">
              JPEG · PNG · WEBP 최대 5MB
            </span>
          </div>

          {/* 우측: 폼 입력 */}
          <div className="flex-1 flex flex-col gap-5">
            {/* 카테고리 이름 */}
            <div className="flex flex-col gap-2">
              <label className="text-body-01-sb text-text-primary flex items-center gap-1">
                카테고리 이름 <span className="text-fill-danger text-body-01-sb">*</span>
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="텍스트, 특수문자, 이모티콘 가능"
                className="w-full p-3 bg-fill-inverse border border-border-default rounded-token-s text-body-02-m text-text-strong placeholder:text-text-quaternary placeholder:font-medium focus:outline-none focus:border-text-strong transition-colors"
              />
            </div>

            {/* 색상 선택 */}
            <div className="flex flex-col gap-2">
              <label className="text-body-01-sb text-text-primary flex items-center gap-1">
                색상 선택 <span className="text-fill-danger text-body-01-sb">*</span>
              </label>
              <div className="flex items-center gap-2">
                {COLORS.map((color, index) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(index)}
                    className={`w-10 h-10 rounded-token-s relative transition-transform ${color} ${
                      selectedColor !== index ? "hover:scale-105" : ""
                    }`}
                    aria-label={`색상 ${index + 1}`}
                  >
                    {selectedColor === index && (
                      <div className={`w-12 h-12 left-[-4px] top-[-4px] absolute rounded-2xl border-[1.5px] ${
                        color === "bg-theme-1-base" ? "border-theme-1-base" :
                        color === "bg-theme-2-base" ? "border-theme-2-base" :
                        color === "bg-theme-3-base" ? "border-theme-3-base" :
                        color === "bg-theme-4-base" ? "border-theme-4-base" :
                        color === "bg-theme-5-base" ? "border-theme-5-base" :
                        "border-theme-6-base"
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 공개 설정 */}
            <div className="flex flex-col gap-2">
              <label className="text-body-01-sb text-text-primary">
                공개 설정
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`w-12 h-7 rounded-full relative transition-colors ${
                    isPublic ? "bg-fill-primary" : "bg-[#d4d4d4]"
                  }`}
                >
                  <div 
                    className={`w-6 h-6 bg-fill-inverse rounded-full absolute top-[2px] transition-all ${
                      isPublic ? "left-[22px]" : "left-[2px]"
                    }`} 
                  />
                </button>
                <span className="text-body-02-m text-text-secondary">
                  {isPublic ? "공개" : "비공개"}
                </span>
              </div>
              <span className="text-xs text-text-teritary whitespace-nowrap">
                비공개 시 팔로잉 유저에게 카테고리, 마일스톤, 태스크 전부 미노출
              </span>
            </div>

            {/* 완료 여부 */}
            <div className="flex flex-col gap-2">
              <label className="text-body-01-sb text-text-primary">
                완료 여부
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompleted(!isCompleted)}
                  className={`w-12 h-7 rounded-full relative transition-colors ${
                    isCompleted ? "bg-fill-primary" : "bg-[#d4d4d4]"
                  }`}
                >
                  <div 
                    className={`w-6 h-6 bg-fill-inverse rounded-full absolute top-[2px] transition-all ${
                      isCompleted ? "left-[22px]" : "left-[2px]"
                    }`} 
                  />
                </button>
                <span className="text-body-02-m text-text-secondary">
                  {isCompleted ? "완료" : "미완료"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 친구와 함께하기 */}
        <div className="bg-fill-surface border border-border-default flex items-center justify-between px-5 py-3 rounded-token-s w-full">
          <div className="flex flex-col gap-1 items-start">
            <p className="font-semibold text-[18px] text-text-primary leading-[1.5] tracking-[-0.18px]">
              친구와 함께하기
            </p>
            <p className="font-normal text-[13px] text-text-teritary leading-[1.3]">
              초대한 친구와 공유 카테고리를 함께 채워요
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsShared(!isShared)}
            className={`w-[52px] h-[30px] rounded-full relative transition-colors ${
              isShared ? "bg-fill-primary" : "bg-btn-teritary"
            }`}
          >
            <div 
              className={`w-6 h-6 bg-fill-inverse rounded-full absolute top-[3px] transition-all ${
                isShared ? "left-[25px]" : "left-[3px]"
              }`} 
            />
          </button>
        </div>

        {/* 구성원 */}
        {isShared && (
          <div className="flex flex-col gap-2 w-full relative">
            <h3 className="font-semibold text-[18px] text-text-primary leading-[1.5] tracking-[-0.18px]">
              구성원
            </h3>
            <div className="bg-fill-surface border border-border-default flex gap-3 items-center px-5 py-3 rounded-token-s w-full flex-wrap">
              
              {/* 추가된 멤버 렌더링 */}
              {selectedMembers.map((member) => (
                <div key={member.id} className="bg-[#e5e5e5] drop-shadow-sm flex gap-3 items-center p-2 rounded-full">
                  <div className="flex gap-2 items-center">
                    <div className="w-9 h-9 rounded-full bg-gray-300 border border-border-default flex-shrink-0" />
                    <span className="font-medium text-[18px] text-text-strong tracking-[-0.18px]">{member.name}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => toggleMember(member)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#737373"/>
                    </svg>
                  </button>
                </div>
              ))}

              {/* 검색 및 추가 인풋 */}
              <div className="relative flex-1 min-w-[150px]">
                <input
                  type="text"
                  placeholder="친구 추가..."
                  className="w-full bg-transparent outline-none text-[16px] text-text-primary placeholder:text-text-teritary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                />
              </div>
            </div>

            {/* 드롭다운 리스트 */}
            {isDropdownOpen && filteredFriends.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-fill-inverse border border-border-default rounded-token-s shadow-shadow-m max-h-48 overflow-y-auto z-10">
                {filteredFriends.map((friend) => (
                  <div 
                    key={friend.id}
                    onClick={() => toggleMember(friend)}
                    className="flex gap-3 items-center px-4 py-3 hover:bg-fill-surface cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-300 border border-border-default flex-shrink-0" />
                    <span className="font-medium text-[16px] text-text-primary">{friend.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex flex-col gap-5 mt-2">
          <div className="flex items-center gap-3 w-full">
            {mode === "edit" && (
              <button
                type="button"
                onClick={onRequestDelete}
                className="w-11 h-11 flex-shrink-0 bg-fill-danger rounded-token-s flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="white"/>
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-btn-quaternary text-text-strong rounded-token-s font-medium hover:bg-btn-pressed transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-btn-primary text-text-onFill rounded-token-s font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!categoryName || selectedColor === null}
            >
              {mode === "create" ? "추가" : "수정"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
