import { useMemo, useState } from "react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import SidebarOpenIcon from "@/assets/icons/sidebar-open.svg?react";
import SidebarCloseIcon from "@/assets/icons/sidebar-close.svg?react";

type CalendarDay = {
  day: number;
  monthOffset: -1 | 0 | 1;
};

type CalendarEvent = {
  id: string;
  title: string;
  widthClass: string;
  topClass: string;
  leftClass: string;
  bgClass: string;
  accentClass: string;
};

type CalendarWeek = {
  days: CalendarDay[];
  events?: CalendarEvent[];
};

const dayLabels = [
  { label: "일", textClass: "text-fill-danger" },
  { label: "월", textClass: "text-text-secondary" },
  { label: "화", textClass: "text-text-secondary" },
  { label: "수", textClass: "text-text-secondary" },
  { label: "목", textClass: "text-text-secondary" },
  { label: "금", textClass: "text-text-secondary" },
  { label: "토", textClass: "text-fill-info" },
];

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

const getDayTextClass = (
  columnIndex: number,
  monthOffset: CalendarDay["monthOffset"],
  isSelected: boolean,
) => {
  if (isSelected) {
    return "text-text-onFill";
  }

  if (monthOffset === -1 || monthOffset === 1) {
    if (columnIndex === 0) return "text-fill-danger opacity-50";
    if (columnIndex === 6) return "text-text-saturday opacity-50";
    return "text-text-quaternary";
  }

  if (columnIndex === 0) return "text-fill-danger";
  if (columnIndex === 6) return "text-fill-info";
  return "text-text-strong";
};

type MonthlyCalendarProps = {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export const MonthlyCalendarSection = ({
  isSidebarOpen = true,
  onToggleSidebar,
}: MonthlyCalendarProps = {}): JSX.Element => {
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
          <button 
            onClick={onToggleSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-token-s bg-btn-quaternary text-text-strong hover:bg-btn-pressed transition-colors"
            aria-label={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
          >
            {isSidebarOpen ? (
              <SidebarCloseIcon className="h-6 w-6 text-text-strong" />
            ) : (
              <SidebarOpenIcon className="h-6 w-6 text-text-strong" />
            )}
          </button>
          <div className="relative inline-flex items-center gap-token-l px-2">
            <div className="inline-flex items-center gap-2 text-title-01-sb text-text-strong">
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
                className="flex h-10 w-10 items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-strong transition-colors hover:bg-btn-pressed"
                onClick={handlePreviousMonth}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                className="flex items-center justify-center rounded-token-infinite bg-btn-quaternary px-4 py-2 transition-colors hover:bg-btn-pressed"
                onClick={handleToday}
              >
                <span className="text-body-02-sb text-text-secondary">오늘</span>
              </button>
              <button
                aria-label="다음 달"
                className="flex h-10 w-10 items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-strong transition-colors hover:bg-btn-pressed"
                onClick={handleNextMonth}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="relative flex w-full flex-1 grow flex-col items-start gap-3 self-stretch">
          {/* 요일 헤더 */}
          <div
            aria-hidden="true"
            className="relative flex w-full flex-[0_0_auto] items-center self-stretch"
          >
            {dayLabels.map((day) => (
              <div key={day.label} className="relative h-[45px] flex-1 grow">
                <div className={`absolute left-2 top-2 text-body-01-m ${day.textClass}`}>
                  {day.label}
                </div>
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="relative flex w-full flex-1 grow flex-col items-start self-stretch">
            {weeks.map((week, weekIndex) => (
              <div
                key={`week-${weekIndex}`}
                className="relative flex w-full flex-1 grow items-center self-stretch"
                role="row"
              >
                {/* 각 일(Day) 셀 */}
                {week.days.map((day, dayIndex) => {
                  const isSelected =
                    currentYear === todayDate.getFullYear() &&
                    currentMonth === todayDate.getMonth() + 1 &&
                    day.day === todayDate.getDate() &&
                    day.monthOffset === 0;

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}-${day.day}`}
                      className="relative flex-1 grow self-stretch"
                      role="gridcell"
                      aria-selected={isSelected}
                    >
                      {isSelected ? (
                        <div className="relative left-[3px] top-1.5 flex h-8 w-8 flex-col items-center justify-center rounded-[16px] bg-fill-primary">
                          <span className="text-body-01-sb text-text-onFill">
                            {day.day}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`absolute left-2 top-2 text-body-01-sb ${getDayTextClass(
                            dayIndex,
                            day.monthOffset,
                            false
                          )}`}
                        >
                          {day.day}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 마일스톤(이벤트) 렌더링 */}
                {week.events?.map((event) => (
                  <div
                    key={event.id}
                    className={`absolute ${event.leftClass} ${event.topClass} ${event.widthClass} flex items-center gap-2 overflow-hidden rounded-[4px] ${event.bgClass} px-3 py-1 shadow-shadow-s pointer-events-auto`}
                  >
                    <div className="flex-1 truncate text-body-03-r text-text-strong">
                      {event.title}
                    </div>
                    {/* 이벤트 좌측 액센트 바 (포인트 컬러) */}
                    <div
                      className={`absolute bottom-[3px] left-0 top-[3px] w-1 rounded-[4px] ${event.accentClass}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
