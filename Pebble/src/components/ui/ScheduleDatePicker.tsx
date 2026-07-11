import { type DateType, type DayStatus } from "@/hooks/useScheduleDatePicker";

type ScheduleDatePickerVariant = "milestone" | "task";

type ScheduleDatePickerProps = {
  variant: ScheduleDatePickerVariant;
  dateType: DateType;
  onDateTypeChange: (dateType: DateType) => void;
  currentYear: number;
  currentMonth: number;
  daysInMonth: number;
  firstDay: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (day: number) => void;
  getDayStatus: (day: number) => DayStatus;
  themeBaseClass?: string;
  themeLightClass?: string;
};

const DATE_TYPES: DateType[] = ["하루", "기간", "다중"];
const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const DATE_TYPE_DESCRIPTIONS: Record<DateType, string> = {
  하루: "특정한 날만",
  기간: "시작부터 끝까지",
  다중: "여러 날을 골라 담아",
};

export const ScheduleDatePicker = ({
  variant,
  dateType,
  onDateTypeChange,
  currentYear,
  currentMonth,
  daysInMonth,
  firstDay,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  getDayStatus,
  themeBaseClass = "bg-btn-primary",
  themeLightClass = "bg-black/5",
}: ScheduleDatePickerProps) => {
  const isTaskVariant = variant === "task";
  const daySizeClass = isTaskVariant ? "w-10 h-10" : "w-12 h-12";
  const wrapperHeightClass = isTaskVariant ? "h-10" : "h-12";

  const getTypeButtonClass = (type: DateType) => {
    const baseClass = isTaskVariant
      ? "flex-[1] px-5 py-3 rounded-[12px] flex flex-col items-center justify-center gap-1 transition-colors"
      : "flex-1 p-4 rounded-[12px] flex flex-col items-start gap-1 transition-colors";

    const activeClass = isTaskVariant
      ? "bg-btn-primary text-text-onFill"
      : "bg-btn-primary text-fill-inverse";

    const inactiveClass = isTaskVariant
      ? "bg-btn-quaternary text-text-strong"
      : "bg-fill-surface text-text-strong";

    return `${baseClass} ${dateType === type ? activeClass : inactiveClass}`;
  };

  const getDayButtonClass = (status: DayStatus) => {
    const baseClass = `${daySizeClass} rounded-[12px] flex items-center justify-center text-[16px] font-medium transition-colors z-10 relative`;

    if (status === "selected" || status === "range-start" || status === "range-end") {
      return `${baseClass} ${themeBaseClass} text-fill-inverse`;
    }

    if (status === "today") {
      return `${baseClass} bg-fill-surface text-text-strong`;
    }

    return `${baseClass} text-text-strong hover:bg-fill-surface`;
  };

  const renderRangeBackground = (status: DayStatus) => {
    if (status === "range-start") {
      return <div className={`absolute right-0 top-0 h-full w-1/2 ${themeLightClass}`} />;
    }

    if (status === "range-end") {
      return <div className={`absolute left-0 top-0 h-full w-1/2 ${themeLightClass}`} />;
    }

    if (status === "in-range") {
      return <div className={`absolute inset-0 ${themeLightClass}`} />;
    }

    return null;
  };

  return (
    <>
      <div className={`flex gap-3 w-full ${isTaskVariant ? "mt-2" : ""}`}>
        {DATE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onDateTypeChange(type)}
            className={getTypeButtonClass(type)}
          >
            <span
              className={
                isTaskVariant
                  ? `text-[16px] font-medium tracking-[-0.16px] leading-[1.5] ${
                      dateType === type ? "text-fill-inverse" : "text-text-strong"
                    }`
                  : `text-[16px] font-semibold ${
                      dateType === type ? "text-fill-inverse" : "text-text-strong"
                    }`
              }
            >
              {type}
            </span>
            <span
              className={
                isTaskVariant
                  ? `text-[14px] tracking-[-0.14px] leading-[1.5] ${
                      dateType === type ? "text-fill-inverse opacity-80" : "text-text-secondary"
                    }`
                  : `text-[13px] ${
                      dateType === type ? "text-fill-inverse opacity-80" : "text-text-secondary"
                    }`
              }
            >
              {DATE_TYPE_DESCRIPTIONS[type]}
            </span>
          </button>
        ))}
      </div>

      <div className={`flex flex-col gap-4 w-full ${isTaskVariant ? "mt-3" : ""}`}>
        <div
          className={
            isTaskVariant
              ? "flex items-center justify-center w-full relative"
              : "flex items-center gap-2"
          }
        >
          {!isTaskVariant && (
            <span className="text-[20px] font-bold text-text-strong tracking-[-0.2px] mr-2">
              {currentYear}년 {currentMonth + 1}월
            </span>
          )}
          <button
            onClick={onPrevMonth}
            className={`${
              isTaskVariant ? "absolute left-[35%]" : ""
            } w-8 h-8 flex items-center justify-center rounded-full bg-fill-surface hover:bg-black/5 transition-colors`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#171717" />
            </svg>
          </button>
          {isTaskVariant && (
            <span className="text-[20px] font-semibold text-text-strong tracking-[-0.2px]">
              {currentYear}년 {currentMonth + 1}월
            </span>
          )}
          <button
            onClick={onNextMonth}
            className={`${
              isTaskVariant ? "absolute right-[35%]" : ""
            } w-8 h-8 flex items-center justify-center rounded-full bg-fill-surface hover:bg-black/5 transition-colors`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="#171717" />
            </svg>
          </button>
        </div>

        <div className={`grid grid-cols-7 gap-y-4 gap-x-2 w-full text-center ${isTaskVariant ? "px-4" : ""}`}>
          {WEEK_DAYS.map((day) => (
            <span key={day} className="text-[14px] text-text-teritary font-medium">
              {day}
            </span>
          ))}

          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const status = getDayStatus(day);

            return (
              <div key={day} className={`w-full ${wrapperHeightClass} flex items-center justify-center relative overflow-hidden`}>
                {renderRangeBackground(status)}
                <button onClick={() => onDateClick(day)} className={getDayButtonClass(status)}>
                  {day}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
