type ProgressBarProps = {
  progress: number;
  themeBaseClass?: string;
  className?: string;
};

export const ProgressBar = ({
  progress,
  themeBaseClass = "bg-theme-1-base",
  className = "",
}: ProgressBarProps) => {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  // Extract text color class from bg class if needed, e.g. bg-theme-1-base -> text-theme-1-base
  const textColorClass = themeBaseClass.replace("bg-", "text-");

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex items-end gap-2">
        <span className="text-body-02-sb text-text-strong">현재 진행률</span>
        <span className={`text-[14px] font-medium leading-5 ${textColorClass}`}>
          {safeProgress}%
        </span>
      </div>
      <div className="w-full h-2 bg-fill-teritory rounded-token-infinite overflow-hidden">
        <div
          className={`h-full ${themeBaseClass} transition-all duration-300`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
