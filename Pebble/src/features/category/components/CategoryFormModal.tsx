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
  const [categoryName, setCategoryName] = useState(category?.title || "");

  // Update input when category prop changes
  React.useEffect(() => {
    if (mode === "edit" && category) {
      setCategoryName(category.title);
      // We could also set selectedColor etc. here based on category if needed
    } else {
      setCategoryName("");
      setSelectedColor(null);
    }
  }, [mode, category, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[675px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-10 shadow-shadow-m relative">
        <header className="flex items-center justify-between">
          <h2 className="text-heading-02 text-text-strong">
            {mode === "create" ? "카테고리 생성" : "카테고리 편집"}
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

        {/* 하단 버튼 */}
        <div className="flex flex-col gap-5 mt-2">
          <div className="flex items-center gap-3">
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
              {mode === "create" ? "생성" : "수정"}
            </button>
          </div>
          
          {mode === "edit" && (
            <div className="flex justify-center items-center mt-2">
              <button 
                type="button"
                onClick={onRequestDelete}
                className="text-fill-danger text-sm font-medium leading-5 hover:opacity-80 transition-opacity"
              >
                카테고리 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
