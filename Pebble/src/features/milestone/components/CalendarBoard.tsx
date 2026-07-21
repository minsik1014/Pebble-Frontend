import { useMemo } from "react";
import { MonthSelector } from "./MonthSelector";
import { CalendarGrid } from "./CalendarGrid";
import { generateWeeks } from "./calendarWeeks";
import { type Category, type TaskItem } from "@/types";

type CalendarBoardProps = {
  isSidebarOpen?: boolean;
  categories?: Category[];
  standaloneTasks?: TaskItem[];
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
};

export const CalendarBoard = ({
  isSidebarOpen = true,
  categories = [],
  standaloneTasks = [],
  currentYear,
  currentMonth,
  onChangeCalendarMonth,
}: CalendarBoardProps): JSX.Element => {
  const todayDate = useMemo(() => new Date(), []);
  const displayedYear = useMemo(() => currentYear, [currentYear]);
  const displayedMonth = useMemo(() => currentMonth, [currentMonth]);
  const weeks = useMemo(
    () => generateWeeks(currentYear, currentMonth, categories, standaloneTasks),
    [currentYear, currentMonth, categories, standaloneTasks],
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
      className={`flex h-[1000px] flex-col overflow-hidden bg-fill-inverse shadow-shadow-m shrink-0 transition-all duration-300 ${
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

        <CalendarGrid 
          weeks={weeks} 
          currentYear={currentYear} 
          currentMonth={currentMonth} 
          todayDate={todayDate} 
        />
      </div>
    </section>
  );
};
