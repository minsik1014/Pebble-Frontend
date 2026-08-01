import DeleteIcon from "@/assets/icons/Delete.svg?react";

type ModalActionBarProps = {
  submitLabel: string;
  disabled?: boolean;
  onCancel: () => void;
  onSubmit: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  deleteLabel?: string;
};

export const ModalActionBar = ({
  submitLabel,
  disabled = false,
  onCancel,
  onSubmit,
  onDelete,
  deleteLabel = "삭제",
}: ModalActionBarProps) => (
  <div className="flex w-full gap-3">
    {onDelete && (
      <button
        type="button"
        onClick={onDelete}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-token-s bg-fill-danger transition-colors before:pointer-events-none before:absolute before:inset-0 before:transition-colors hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)]"
        aria-label={deleteLabel}
      >
        <DeleteIcon className="relative z-10 h-6 w-6 text-fill-inverse" />
      </button>
    )}
    <button
      type="button"
      onClick={onCancel}
      className="relative h-11 flex-1 overflow-hidden rounded-token-s bg-btn-quaternary font-medium text-text-strong transition-colors before:pointer-events-none before:absolute before:inset-0 before:transition-colors hover:before:bg-[rgba(23,23,23,0.05)] active:before:bg-[rgba(23,23,23,0.1)]"
    >
      취소
    </button>
    <button
      type="button"
      onClick={onSubmit}
      className="relative h-11 flex-1 overflow-hidden rounded-token-s bg-btn-primary font-medium text-text-onFill transition-colors before:pointer-events-none before:absolute before:inset-0 before:transition-colors hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:before:bg-transparent"
      disabled={disabled}
    >
      {submitLabel}
    </button>
  </div>
);
