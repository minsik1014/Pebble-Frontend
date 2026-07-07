import { useMemo, useState } from "react";
import { type CalendarDay, type CalendarWeek } from "./types";
import { MonthSelector } from "./MonthSelector";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { CalendarGrid } from "./CalendarGrid";

const INITIAL_YEAR = 2026;
const INITIAL_MONTH = 6;
const INITIAL_SELECTED_DATE = new Date(2026, 5, 4);

const getJuneEventLayout = (isSidebarOpen: boolean) => ({
  secondWeek: isSidebarOpen
    ? {
        expoPlan: { widthClass: "w-[371px]", leftClass: "left-1" },
        backendProject: { widthClass: "w-[482px]", leftClass: "left-[124px]" },
        startupReport: { widthClass: "w-[110px]", leftClass: "left-[616px]" },
        mvpPage: { widthClass: "w-[229px]", leftClass: "left-[124px]" },
        planSubmit: { widthClass: "w-[110px]", leftClass: "left-[379px]" },
      }
    : {
        expoPlan: { widthClass: "w-[349px]", leftClass: "left-1" },
        backendProject: { widthClass: "w-[467px]", leftClass: "left-[124px]" },
        startupReport: { widthClass: "w-[110px]", leftClass: "left-[600px]" },
        mvpPage: { widthClass: "w-[229px]", leftClass: "left-[124px]" },
        planSubmit: { widthClass: "w-[110px]", leftClass: "left-[362px]" },
      },
  thirdWeek: isSidebarOpen
    ? {
        operatingStudy: { widthClass: "w-[361px]", leftClass: "left-1" },
        backendSubmit: { widthClass: "w-[112px]", leftClass: "left-[379px]" },
        operatingTest: { widthClass: "w-[112px]", leftClass: "left-[379px]" },
      }
    : {
        operatingStudy: { widthClass: "w-[352px]", leftClass: "left-1" },
        backendSubmit: { widthClass: "w-[112px]", leftClass: "left-[364px]" },
        operatingTest: { widthClass: "w-[112px]", leftClass: "left-[364px]" },
      },
});

const generateWeeks = (year: number, month: number, isSidebarOpen: boolean): CalendarWeek[] => {
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
    const eventLayout = getJuneEventLayout(isSidebarOpen);

    weeks[1].events = [
      {
        id: "expo-plan",
        title: "EXPO 계획서 작성하기",
        widthClass: eventLayout.secondWeek.expoPlan.widthClass,
        topClass: "top-[43px]",
        leftClass: eventLayout.secondWeek.expoPlan.leftClass,
        bgClass: "bg-theme-1-light",
        accentClass: "bg-theme-1-base",
      },
      {
        id: "backend-project",
        title: "백엔드 프로젝트",
        widthClass: eventLayout.secondWeek.backendProject.widthClass,
        topClass: "top-[76px]",
        leftClass: eventLayout.secondWeek.backendProject.leftClass,
        bgClass: "bg-theme-3-mid",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "startup-report",
        title: "창업실무 보고서",
        widthClass: eventLayout.secondWeek.startupReport.widthClass,
        topClass: "top-[76px]",
        leftClass: eventLayout.secondWeek.startupReport.leftClass,
        bgClass: "bg-theme-3-mid",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "mvp-page",
        title: "MVP 페이지 구현",
        widthClass: eventLayout.secondWeek.mvpPage.widthClass,
        topClass: "top-[109px]",
        leftClass: eventLayout.secondWeek.mvpPage.leftClass,
        bgClass: "bg-theme-3-light",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "plan-submit",
        title: "계획서 제출",
        widthClass: eventLayout.secondWeek.planSubmit.widthClass,
        topClass: "top-[43px]",
        leftClass: eventLayout.secondWeek.planSubmit.leftClass,
        bgClass: "bg-theme-1-mid",
        accentClass: "bg-theme-1-base",
      },
    ];
    weeks[2].events = [
      {
        id: "operating-study",
        title: "운영시스템 공부",
        widthClass: eventLayout.thirdWeek.operatingStudy.widthClass,
        topClass: "top-[43px]",
        leftClass: eventLayout.thirdWeek.operatingStudy.leftClass,
        bgClass: "bg-theme-5-light",
        accentClass: "bg-theme-5-base",
      },
      {
        id: "backend-submit",
        title: "백엔드 보고서 제출",
        widthClass: eventLayout.thirdWeek.backendSubmit.widthClass,
        topClass: "top-[43px]",
        leftClass: eventLayout.thirdWeek.backendSubmit.leftClass,
        bgClass: "bg-theme-3-light",
        accentClass: "bg-theme-3-base",
      },
      {
        id: "operating-test",
        title: "운영시스템 시험",
        widthClass: eventLayout.thirdWeek.operatingTest.widthClass,
        topClass: "top-[76px]",
        leftClass: eventLayout.thirdWeek.operatingTest.leftClass,
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
