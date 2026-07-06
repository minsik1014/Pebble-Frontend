import { useMemo, useState } from "react";
import { type CalendarDay, type CalendarWeek } from "./types";
import { MonthSelector } from "./MonthSelector";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { CalendarGrid } from "./CalendarGrid";

const generateWeeks = (year: number, month: number): CalendarWeek[] => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const weeks: CalendarWeek[] = [];
  let currentDay = 1;
  let nextMonthDay = 1;

  for (let weekIdx = 0; weekIdx < 6; weekIdx++) {
    const days: CalendarDay[] = [];
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (weekIdx === 0 && dayOfWeek < startDayOfWeek) {
        days.push({
          day: daysInPrevMonth - startDayOfWeek + dayOfWeek + 1,
          monthOffset: -1,
        });
      } else if (currentDay <= daysInMonth) {
        days.push({
          day: currentDay,
          monthOffset: 0,
        });
        currentDay++;
      } else {
        days.push({
          day: nextMonthDay,
          monthOffset: 1,
        });
        nextMonthDay++;
      }
    }
    weeks.push({ days });
    if (currentDay > daysInMonth) {
      break;
    }
  }

  // Preserve dummy events for June 2026 for demonstration
  if (year === 2026 && month === 6 && weeks.length > 2) {
    weeks[1].events = [
      {
        id: "expo-plan",
        title: "EXPO 계획서 작성하기",
        widthClass: "w-[349px]",
        topClass: "top-[43px]",
        leftClass: "left-1",
        bgClass: "bg-theme-1-light",
        accentClass: "bg-theme-1-base",
      },
      {
        id: "backend-project",
        title: "백엔드 프로젝트",
        widthClass: "w-[467px]",
        topClass: "top-[76px]",
        leftClass: "left-[124px]",
        bgClass: "bg-theme-3-mid",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "startup-report",
        title: "창업실무 보고서",
        widthClass: "w-[110px]",
        topClass: "top-[76px]",
        leftClass: "left-[600px]",
        bgClass: "bg-theme-3-mid",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "mvp-page",
        title: "MVP 페이지 구현",
        widthClass: "w-[229px]",
        topClass: "top-[109px]",
        leftClass: "left-[124px]",
        bgClass: "bg-theme-3-light",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "plan-submit",
        title: "계획서 제출",
        widthClass: "w-[110px]",
        topClass: "top-[43px]",
        leftClass: "left-[362px]",
        bgClass: "bg-theme-1-mid",
        accentClass: "bg-theme-1-base",
      },
    ];
    weeks[2].events = [
      {
        id: "operating-study",
        title: "운영시스템 공부",
        widthClass: "w-[349px]",
        topClass: "top-[43px]",
        leftClass: "left-1",
        bgClass: "bg-theme-5-light",
        accentClass: "bg-theme-5-base",
      },
      {
        id: "backend-submit",
        title: "백엔드 보고서 제출",
        widthClass: "w-[110px]",
        topClass: "top-[43px]",
        leftClass: "left-[364px]",
        bgClass: "bg-theme-3-light",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "operating-test",
        title: "운영시스템 시험",
        widthClass: "w-[110px]",
        topClass: "top-[76px]",
        leftClass: "left-[364px]",
        bgClass: "bg-theme-5-light",
        accentClass: "bg-theme-5-base",
      },
    ];
  }

  return weeks;
};

type CalendarBoardProps = {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export const CalendarBoard = ({
  isSidebarOpen = true,
  onToggleSidebar,
}: CalendarBoardProps = {}): JSX.Element => {
  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth() + 1);

  const displayedYear = useMemo(() => currentYear, [currentYear]);
  const displayedMonth = useMemo(() => currentMonth, [currentMonth]);
  const weeks = useMemo(() => generateWeeks(currentYear, currentMonth), [currentYear, currentMonth]);

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
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  return (
    <section
      aria-label="월간 캘린더"
      className={`flex mt-token-m h-[1000px] flex-col overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m shrink-0 transition-all duration-300 ${
        isSidebarOpen ? "w-[898px]" : "w-[1290px]"
      }`}
    >
      <div 
        className="relative ml-6 mt-8 flex h-[936px] flex-col items-start gap-token-l transition-all duration-300"
        style={{ width: isSidebarOpen ? 834 : 1226 }}
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
