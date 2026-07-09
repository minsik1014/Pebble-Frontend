import { useMemo, useState } from "react";
import { MonthSelector } from "./MonthSelector";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { CalendarGrid } from "./CalendarGrid";
import { generateWeeks } from "./calendarWeeks";

const INITIAL_YEAR = 2026;
const INITIAL_MONTH = 6;
const INITIAL_SELECTED_DATE = new Date(2026, 5, 4);

type CalendarBoardProps = {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export const CalendarBoard = ({
  isSidebarOpen = true,
  onToggleSidebar,
}: CalendarBoardProps = {}): JSX.Element => {
  const todayDate = INITIAL_SELECTED_DATE;
  const [currentYear, setCurrentYear] = useState(INITIAL_YEAR);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_MONTH);

  const displayedYear = useMemo(() => currentYear, [currentYear]);
  const displayedMonth = useMemo(() => currentMonth, [currentMonth]);
  const weeks = useMemo(
    () => generateWeeks(currentYear, currentMonth, isSidebarOpen),
    [currentYear, currentMonth, isSidebarOpen],
  );

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 1) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 12;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 12) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 1;
      }
      return prevMonth + 1;
    });
  };

  const handleToday = () => {
    setCurrentYear(INITIAL_YEAR);
    setCurrentMonth(INITIAL_MONTH);
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
        <header className="inline-flex items-end gap-1">
          <SidebarToggleButton 
            isSidebarOpen={isSidebarOpen} 
            onToggle={onToggleSidebar || (() => {})} 
          />
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
