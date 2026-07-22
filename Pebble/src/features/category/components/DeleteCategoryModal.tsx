import { useEffect, useState } from "react";
import CloseIcon from "@/assets/icons/Close.svg?react";
import { type Category } from "@/types";

type DeleteCategoryModalProps = {
  isOpen: boolean;
  category: Category;
  onClose: () => void;
  onDelete: () => void;
};

export const DeleteCategoryModal = ({
  isOpen,
  category,
  onClose,
  onDelete,
}: DeleteCategoryModalProps) => {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatched = confirmText === category.title;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-fill-shadow">
      <div className="w-[655px] p-8 bg-fill-inverse rounded-[32px] shadow-shadow-m flex flex-col gap-5 relative">
        
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="pt-2">
            <h2 className="text-title-02-sb text-text-strong">
              ‘{category.title}’ 카테고리를 삭제하시겠어요?
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-fill-surface transition-colors"
          >
            <CloseIcon className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* 확인 입력 영역 */}
        <div className="w-full flex flex-col gap-3">
          <p className="text-body-01-m text-text-strong">
            동의하시면 하단에 카테고리 이름을 적어주세요!
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={category.title}
            className="w-full p-3 bg-fill-inverse border border-border-default rounded-xl text-body-02-m text-text-strong placeholder:text-text-quaternary focus:outline-none focus:border-text-strong transition-colors"
          />
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 bg-btn-quaternary text-text-strong rounded-token-s font-medium hover:bg-btn-pressed transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              if (isMatched) onDelete();
            }}
            disabled={!isMatched}
            className={`flex-1 h-11 rounded-token-s font-medium transition-all flex items-center justify-center ${
              isMatched 
                ? "bg-fill-danger text-text-onFill hover:opacity-90" 
                : "bg-fill-danger opacity-50 text-text-onFill cursor-not-allowed"
            }`}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};
