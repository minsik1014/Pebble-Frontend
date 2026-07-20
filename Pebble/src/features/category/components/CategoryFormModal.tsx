import { useEffect, useState } from "react";
import { type Category } from "@/types";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryImageUploader } from "./CategoryImageUploader";
import { CategoryMemberSelector } from "./CategoryMemberSelector";
import {
  DEFAULT_CATEGORY_COLOR,
  createCategoryColorTheme,
  DUMMY_FRIENDS,
  type Friend,
} from "./categoryFormOptions";
import type { CreateCategoryInput } from "@/features/calendar/hooks/useCalendarState";

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  category?: Category;
  onClose: () => void;
  onRequestDelete?: () => void;
  onSubmit?: (input: CreateCategoryInput) => void;
};

type ToggleControlProps = {
  checked: boolean;
  checkedLabel: string;
  uncheckedLabel: string;
  onToggle: () => void;
};

const InfoBadge = ({ description }: { description: string }) => (
  <span className="group relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-border-default text-caption-01 text-text-quaternary">
    !
    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 hidden w-max max-w-[260px] -translate-x-1/2 rounded-token-s bg-fill-primary px-3 py-2 text-left text-caption-01 text-text-onFill shadow-shadow-s group-hover:block">
      {description}
    </span>
  </span>
);

const ToggleControl = ({
  checked,
  checkedLabel,
  uncheckedLabel,
  onToggle,
}: ToggleControlProps) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-[30px] w-[52px] rounded-token-infinite transition-colors ${
        checked ? "bg-fill-primary" : "bg-border-default"
      }`}
    >
      <span
        className={`absolute top-[3px] h-6 w-6 rounded-token-infinite bg-fill-inverse transition-all ${
          checked ? "left-[25px]" : "left-[3px]"
        }`}
      />
    </button>
    <span className="text-body-02-m text-text-secondary">
      {checked ? checkedLabel : uncheckedLabel}
    </span>
  </div>
);

export const CategoryFormModal = ({ 
  isOpen, 
  mode = "create", 
  category,
  onClose,
  onRequestDelete,
  onSubmit,
}: CategoryFormModalProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_CATEGORY_COLOR);
  const [isPublic, setIsPublic] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [categoryName, setCategoryName] = useState(category?.title || "");
  const [imageUrl, setImageUrl] = useState<string | undefined>(category?.imageUrl);

  const [selectedMembers, setSelectedMembers] = useState<Friend[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedTheme = createCategoryColorTheme(selectedColor);

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
      setSelectedColor(category.accent);
      setImageUrl(category.imageUrl);
      setIsPublic(true);
      setIsCompleted(false);
      setIsShared(false);
      setSelectedMembers([]);
    } else {
      setCategoryName("");
      setImageUrl(undefined);
      setSelectedColor(DEFAULT_CATEGORY_COLOR);
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
    if (!categoryName.trim()) {
      return;
    }

    onSubmit?.({
      title: categoryName.trim(),
      accent: selectedTheme.accent,
      themeBase: selectedTheme.themeBase,
      themeMid: selectedTheme.themeMid,
      themeLight: selectedTheme.themeLight,
      imageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="flex w-[607px] flex-col items-center gap-5 rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m">
        <header className="flex w-full items-center justify-between">
          <h2 className="w-full text-title-02-sb text-text-strong">
            {mode === "create" ? "카테고리 추가하기" : "카테고리 편집하기"}
          </h2>
        </header>

        <div className="flex w-full flex-col items-start gap-5">
          <div className="flex w-full items-start gap-token-xxl">
            <CategoryImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
            />

            <div className="flex w-[328px] flex-col justify-center gap-5">
              <div className="flex w-full flex-col gap-2">
                <label className="text-body-01-sb text-text-primary flex items-center gap-1">
                  카테고리 이름 <span className="text-fill-danger text-body-01-sb">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="텍스트, 특수문자, 이모티콘 가능"
                  className="w-full rounded-token-s border border-border-default bg-fill-inverse p-token-m text-body-02-m text-text-primary placeholder:text-text-quaternary focus:border-text-strong focus:outline-none"
                />
              </div>

              <CategoryColorPicker
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              <div className="flex w-full flex-col gap-2 rounded-token-s">
                <p className="text-body-02-m text-text-teritary">자동 적용 미리보기</p>
                <div className="flex h-10 w-full gap-2 overflow-hidden">
                  <div
                    className="h-full w-10 shrink-0 rounded-token-s shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]"
                    style={{ backgroundColor: selectedTheme.themeBase }}
                  />
                  <div
                    className="flex h-full flex-1 items-center justify-center rounded-token-s shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]"
                    style={{ backgroundColor: selectedTheme.themeMid }}
                  >
                    <span className="text-body-03-r text-text-strong">마일스톤</span>
                  </div>
                  <div
                    className="flex h-full flex-1 items-center justify-center rounded-token-s shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]"
                    style={{ backgroundColor: selectedTheme.themeLight }}
                  >
                    <span className="text-body-03-r text-text-strong">태스크</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full items-start rounded-token-s bg-fill-surface px-token-l py-token-m">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center gap-1">
                <span className="text-body-01-sb text-text-primary">공개 설정</span>
                <InfoBadge description="비공개 시 팔로잉 유저에게 카테고리, 마일스톤, 태스크 전부 미노출" />
              </div>
              <ToggleControl
                checked={isPublic}
                checkedLabel="공개"
                uncheckedLabel="비공개"
                onToggle={() => setIsPublic(!isPublic)}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center gap-1">
                <span className="text-body-01-sb text-text-primary">완료 여부</span>
                <InfoBadge description="완료 처리 시 완료된 카테고리로 분류됩니다" />
              </div>
              <ToggleControl
                checked={isCompleted}
                checkedLabel="완료"
                uncheckedLabel="미완료"
                onToggle={() => setIsCompleted(!isCompleted)}
              />
            </div>
          </div>
        </div>

        <div className="bg-fill-inverse border border-border-default flex items-center justify-between px-5 py-3 rounded-token-s w-full">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-body-01-sb text-text-primary">
              친구와 함께하기
            </p>
            <p className="text-caption-01 text-text-teritary">
              초대한 친구와 공유 카테고리를 함께 채워요
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsShared(!isShared)}
            className={`w-[52px] h-[30px] rounded-token-infinite relative transition-colors ${
              isShared ? "bg-fill-primary" : "bg-btn-teritary"
            }`}
          >
            <div 
              className={`w-6 h-6 bg-fill-inverse rounded-token-infinite absolute top-[3px] transition-all ${
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
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full items-center gap-3">
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
              disabled={!categoryName.trim()}
            >
              {mode === "create" ? "추가" : "수정"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
