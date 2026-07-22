import CloseIcon from "@/assets/icons/Close.svg?react";
import { ModalViewportPanel } from "@/components/ui/ModalViewportPanel";

type AddMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: () => void;
  onSelectMilestone: () => void;
  onSelectTask: () => void;
};

export const AddMenuModal = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectMilestone,
  onSelectTask,
}: AddMenuModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-fill-shadow">
      <ModalViewportPanel
        className="relative flex w-[359px] flex-col gap-5 rounded-[32px] bg-fill-inverse p-8 shadow-shadow-m"
      >
        <header className="flex items-center justify-between">
          <h2 className="text-title-02-sb text-text-strong">추가하기</h2>
          <button
            type="button"
            aria-label="추가하기 모달 닫기"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-token-s text-text-secondary transition-colors hover:bg-fill-surface hover:text-text-strong"
          >
            <CloseIcon className="size-6" aria-hidden="true" />
          </button>
        </header>

        <div className="flex w-full flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              onSelectCategory();
            }}
            className="flex h-11 w-full items-center justify-center rounded-token-s bg-btn-quaternary px-5 text-body-02-m text-text-strong transition-colors hover:bg-btn-pressed"
          >
            카테고리
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectMilestone();
            }}
            className="flex h-11 w-full items-center justify-center rounded-token-s bg-btn-quaternary px-5 text-body-02-m text-text-strong transition-colors hover:bg-btn-pressed"
          >
            마일스톤
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectTask();
            }}
            className="flex h-11 w-full items-center justify-center rounded-token-s bg-btn-quaternary px-5 text-body-02-m text-text-strong transition-colors hover:bg-btn-pressed"
          >
            태스크
          </button>
        </div>
      </ModalViewportPanel>
    </div>
  );
};
