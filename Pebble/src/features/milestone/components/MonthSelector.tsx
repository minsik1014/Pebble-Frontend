import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";

type MonthSelectorProps = {
  displayedYear: number;
  displayedMonth: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export const MonthSelector = ({
  displayedYear,
  displayedMonth,
  onPrevious,
  onNext,
  onToday,
}: MonthSelectorProps) => {
  return (
    <div className="relative inline-flex items-center gap-token-l px-2">
      <div className="inline-flex items-center gap-2 text-title-01-sb text-text-strong shrink-0">
        <span>{displayedYear}년</span>
        <span>{displayedMonth}월</span>
      </div>
      <div
        aria-label="캘린더 이동 컨트롤"
        className="inline-flex items-center gap-2"
        role="group"
      >
        <button
          aria-label="이전 달"
          className="flex h-10 w-10 items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-strong transition-colors hover:bg-btn-pressed shrink-0"
          onClick={onPrevious}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          className="flex items-center justify-center rounded-token-infinite bg-btn-quaternary px-4 py-2 transition-colors hover:bg-btn-pressed shrink-0"
          onClick={onToday}
        >
          <span className="text-body-02-sb text-text-secondary whitespace-nowrap">오늘</span>
        </button>
        <button
          aria-label="다음 달"
          className="flex h-10 w-10 items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-strong transition-colors hover:bg-btn-pressed shrink-0"
          onClick={onNext}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
