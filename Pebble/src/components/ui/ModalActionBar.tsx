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
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-token-s bg-fill-danger transition-opacity hover:opacity-90"
        aria-label={deleteLabel}
      >
        <DeleteIcon className="h-6 w-6 text-fill-inverse" />
      </button>
    )}
    <button
      type="button"
      onClick={onCancel}
      className="h-11 flex-1 rounded-token-s bg-btn-quaternary font-medium text-text-strong transition-colors hover:bg-btn-pressed"
    >
      취소
    </button>
    <button
      type="button"
      onClick={onSubmit}
      className="h-11 flex-1 rounded-token-s bg-btn-primary font-medium text-text-onFill transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
    >
      {submitLabel}
    </button>
  </div>
);
