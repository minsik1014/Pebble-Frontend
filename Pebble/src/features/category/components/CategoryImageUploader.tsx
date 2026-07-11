import UploadIcon from "@/assets/icons/Upload.svg?react";

export const CategoryImageUploader = () => (
  <div className="w-60 h-96 flex flex-col items-start gap-2">
    <label className="text-body-01-sb text-text-primary">대표 이미지 (선택)</label>
    <button
      type="button"
      className="w-full flex-1 flex flex-col items-center justify-center gap-2 bg-fill-surface rounded-token-s border border-border-default hover:bg-fill-surface transition-colors overflow-hidden"
    >
      <UploadIcon className="w-10 h-10 text-text-secondary" />
      <span className="text-body-02-m text-text-secondary">이미지 추가</span>
    </button>
    <span className="w-full text-left text-xs text-text-teritary">
      JPEG · PNG · WEBP 최대 5MB
    </span>
  </div>
);
