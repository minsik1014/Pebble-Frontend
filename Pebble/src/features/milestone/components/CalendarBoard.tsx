import { useMemo } from "react";
import { MonthSelector } from "./MonthSelector";
import { CalendarGrid } from "./CalendarGrid";
import { generateWeeks } from "./calendarWeeks";
import { type Category, type TaskItem } from "@/types";

type CalendarBoardProps = {
  categories?: Category[];
  standaloneTasks?: TaskItem[];
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
};

export const CalendarBoard = ({
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
      className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300"
    >
      <div 
        className="relative flex h-full min-h-0 w-full flex-col items-start gap-token-l px-6 pt-8 pb-6 transition-all duration-300"
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
