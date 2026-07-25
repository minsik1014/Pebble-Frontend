import { useMemo } from "react";
import { MonthSelector } from "./MonthSelector";
import { CalendarGrid } from "./CalendarGrid";
import { generateWeeks } from "./calendarWeeks";
import { type Category, type TaskItem } from "@/types";
import { CalendarStatusView } from "@/features/calendar/components/CalendarStatusView";

type CalendarBoardProps = {
  isSidebarOpen?: boolean;
  categories?: Category[];
  standaloneTasks?: TaskItem[];
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
};

export const CalendarBoard = ({
  isSidebarOpen = true,
  categories = [],
  standaloneTasks = [],
  currentYear,
  currentMonth,
  onChangeCalendarMonth,
  isLoading = false,
  errorMessage = null,
  onRetry,
}: CalendarBoardProps): JSX.Element => {
  const todayDate = useMemo(() => new Date(), []);
  const displayedYear = useMemo(() => currentYear, [currentYear]);
  const displayedMonth = useMemo(() => currentMonth, [currentMonth]);
  const weeks = useMemo(
    () => generateWeeks(currentYear, currentMonth, categories, standaloneTasks),
    [currentYear, currentMonth, categories, standaloneTasks],
  );
  const hasVisibleScheduleItems = useMemo(
    () => weeks.some((week) => (week.events?.length ?? 0) > 0),
    [weeks],
  );

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      onChangeCalendarMonth(currentYear - 1, 12);
      return;
    }

    onChangeCalendarMonth(currentYear, currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      onChangeCalendarMonth(currentYear + 1, 1);
      return;
    }

    onChangeCalendarMonth(currentYear, currentMonth + 1);
  };

  const handleToday = () => {
    const today = new Date();
    onChangeCalendarMonth(today.getFullYear(), today.getMonth() + 1);
  };

  return (
    <section
      aria-label="월간 캘린더"
      className={`flex h-[1000px] shrink-0 flex-col overflow-hidden bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px] rounded-[20px]" : "w-[1316px] rounded-token-l"
      }`}
    >
      <div 
        className={`relative flex flex-col items-start gap-token-l transition-all duration-300 ${
          isSidebarOpen ? "ml-6 mt-8 h-[936px]" : "ml-[93px] mt-10 h-[920px]"
        }`}
        style={{ width: isSidebarOpen ? 876 : 1130 }}
      >
        <header className="inline-flex items-end">
          <MonthSelector 
            displayedYear={displayedYear}
            displayedMonth={displayedMonth}
            onPrevious={handlePreviousMonth}
            onNext={handleNextMonth}
            onToday={handleToday}
          />
        </header>

        <div className="relative flex w-full flex-1 self-stretch">
          <CalendarGrid
            weeks={weeks}
            currentYear={currentYear}
            currentMonth={currentMonth}
            todayDate={todayDate}
          />
          {(isLoading || errorMessage || !hasVisibleScheduleItems) && (
            <div className="absolute inset-[45px_0_0_0] rounded-token-m bg-fill-inverse/80 backdrop-blur-[1px]">
              {isLoading ? (
                <CalendarStatusView
                  title="캘린더를 불러오는 중이에요"
                  description="카테고리, 마일스톤, 태스크 정보를 확인하고 있어요."
                />
              ) : errorMessage ? (
                <CalendarStatusView
                  title="캘린더를 불러오지 못했어요"
                  description={errorMessage}
                  actionLabel="다시 시도"
                  onAction={onRetry}
                />
              ) : (
                <CalendarStatusView
                  title="이번 달 일정이 없어요"
                  description="왼쪽 추가하기 버튼으로 카테고리, 마일스톤, 태스크를 만들어보세요."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
