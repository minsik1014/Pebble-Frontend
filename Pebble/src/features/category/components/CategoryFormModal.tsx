import { useEffect, useState } from "react";
import { type Category } from "@/types";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryImageUploader } from "./CategoryImageUploader";
import { CategoryMemberSelector } from "./CategoryMemberSelector";
import { CategoryToggleField } from "./CategoryToggleField";
import {
  CATEGORY_COLOR_THEMES,
  DUMMY_FRIENDS,
  type Friend,
} from "./categoryFormOptions";
import type {
  CreateCategoryInput,
} from "@/features/calendar/hooks/useCalendarState";

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  category?: Category;
  onClose: () => void;
  onRequestDelete?: () => void;
  onSubmit?: (input: CreateCategoryInput) => void;
};

export const CategoryFormModal = ({ 
  isOpen, 
  mode = "create", 
  category,
  onClose,
  onRequestDelete,
  onSubmit,
}: CategoryFormModalProps) => {
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [categoryName, setCategoryName] = useState(category?.title || "");

  const [selectedMembers, setSelectedMembers] = useState<Friend[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedTheme =
    selectedColor === null ? null : CATEGORY_COLOR_THEMES[selectedColor];

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

  useEffect(() => {
    if (mode === "edit" && category) {
      setCategoryName(category.title);
      setSelectedColor(
        CATEGORY_COLOR_THEMES.findIndex(
          (colorTheme) => colorTheme.themeBase === category.themeBase,
        ),
      );
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

  const handleSubmit = () => {
    if (!categoryName.trim() || !selectedTheme) {
      return;
    }

    onSubmit?.({
      title: categoryName.trim(),
      accent: selectedTheme.accent,
      themeBase: selectedTheme.themeBase,
      themeMid: selectedTheme.themeMid,
      themeLight: selectedTheme.themeLight,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[676px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-10 shadow-shadow-m relative">
        <header className="flex items-center justify-between">
          <h2 className="text-heading-02 text-text-strong">
            {mode === "create" ? "카테고리 추가하기" : "카테고리 편집"}
          </h2>
        </header>

        <div className="flex items-start gap-10">
          <CategoryImageUploader />

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

            <CategoryColorPicker
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />

            <CategoryToggleField
              label="공개 설정"
              checked={isPublic}
              checkedLabel="공개"
              uncheckedLabel="비공개"
              description="비공개 시 팔로잉 유저에게 카테고리, 마일스톤, 태스크 전부 미노출"
              onToggle={() => setIsPublic(!isPublic)}
            />

            <CategoryToggleField
              label="완료 여부"
              checked={isCompleted}
              checkedLabel="완료"
              uncheckedLabel="미완료"
              onToggle={() => setIsCompleted(!isCompleted)}
            />
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

        {isShared && (
          <CategoryMemberSelector
            selectedMembers={selectedMembers}
            filteredFriends={filteredFriends}
            searchQuery={searchQuery}
            isDropdownOpen={isDropdownOpen}
            onSearchChange={setSearchQuery}
            onDropdownOpenChange={setIsDropdownOpen}
            onToggleMember={toggleMember}
          />
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
              onClick={handleSubmit}
              className="flex-1 h-11 bg-btn-primary text-text-onFill rounded-token-s font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!categoryName.trim() || selectedColor === null}
            >
              {mode === "create" ? "추가" : "수정"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
