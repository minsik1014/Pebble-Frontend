import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';

export function ChevronIconArea() {
  return (
    <span
      aria-hidden="true"
      className="flex size-11 shrink-0 items-center justify-center rounded-token-s text-text-secondary"
    >
      <ChevronRightIcon className="size-6" />
    </span>
  );
}