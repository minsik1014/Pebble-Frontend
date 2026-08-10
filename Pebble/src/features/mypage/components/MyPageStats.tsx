type MyPageStatsProps = {
  isCompact: boolean;
  completedCategoryCount: number;
};

export const MyPageStats = ({
  isCompact,
  completedCategoryCount,
}: MyPageStatsProps): JSX.Element => {
  return (
    <div
      className={`mx-auto w-[640px] overflow-hidden transition-[max-height,margin,opacity,transform] duration-500 ease-in-out ${
        isCompact
          ? "pointer-events-none mt-0 max-h-0 -translate-y-3 opacity-0"
          : "mt-11 max-h-[120px] translate-y-0 opacity-100"
      }`}
    >
      <div className="flex h-[120px] items-center justify-center rounded-[40px] bg-fill-surface shadow-shadow-m">
        <div className="flex w-1/2 flex-col items-center gap-1">
          <span className="text-body-01-m text-text-secondary">
            수놓은 조약돌
          </span>
          <strong className="text-title-01-sb text-text-strong">82</strong>
        </div>

        <div
          className="h-[72px] w-px bg-border-default"
          aria-hidden="true"
        />

        <div className="flex w-1/2 flex-col items-center gap-1">
          <span className="text-body-01-m text-text-secondary">
            완료한 카테고리
          </span>
          <strong className="text-title-01-sb text-text-strong">
            {completedCategoryCount}
          </strong>
        </div>
      </div>
    </div>
  );
};
