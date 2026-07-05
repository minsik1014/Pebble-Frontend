import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

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

const weeks: CalendarWeek[] = [
  {
    days: [
      { day: 31, monthOffset: -1 },
      { day: 1, monthOffset: 0 },
      { day: 2, monthOffset: 0 },
      { day: 3, monthOffset: 0 },
      { day: 4, monthOffset: 0 },
      { day: 5, monthOffset: 0 },
      { day: 6, monthOffset: 0 },
    ],
  },
  {
    days: [
      { day: 7, monthOffset: 0 },
      { day: 8, monthOffset: 0 },
      { day: 9, monthOffset: 0 },
      { day: 10, monthOffset: 0 },
      { day: 11, monthOffset: 0 },
      { day: 12, monthOffset: 0 },
      { day: 13, monthOffset: 0 },
    ],
    events: [
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
    ],
  },
  {
    days: [
      { day: 14, monthOffset: 0 },
      { day: 15, monthOffset: 0 },
      { day: 16, monthOffset: 0 },
      { day: 17, monthOffset: 0 },
      { day: 18, monthOffset: 0 },
      { day: 19, monthOffset: 0 },
      { day: 20, monthOffset: 0 },
    ],
    events: [
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
    ],
  },
  {
    days: [
      { day: 21, monthOffset: 0 },
      { day: 22, monthOffset: 0 },
      { day: 23, monthOffset: 0 },
      { day: 24, monthOffset: 0 },
      { day: 25, monthOffset: 0 },
      { day: 26, monthOffset: 0 },
      { day: 27, monthOffset: 0 },
    ],
  },
  {
    days: [
      { day: 28, monthOffset: 0 },
      { day: 29, monthOffset: 0 },
      { day: 30, monthOffset: 0 },
      { day: 1, monthOffset: 1 },
      { day: 2, monthOffset: 1 },
      { day: 3, monthOffset: 1 },
      { day: 4, monthOffset: 1 },
    ],
  },
];

const getDayTextClass = (
  columnIndex: number,
  monthOffset: CalendarDay["monthOffset"],
  isSelected: boolean,
) => {
  if (isSelected) {
    return "text-text-onFill";
  }

  if (monthOffset === -1) {
    return "text-text-sunday";
  }

  if (monthOffset === 1) {
    if (columnIndex === 0) return "text-fill-danger";
    if (columnIndex === 6) return "text-text-saturday";
    return "text-text-quaternary";
  }

  if (columnIndex === 0) return "text-fill-danger";
  if (columnIndex === 6) return "text-fill-info";
  return "text-text-strong";
};

export const MonthlyCalendarSection = (): JSX.Element => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6);

  const displayedYear = useMemo(() => currentYear, [currentYear]);
  const displayedMonth = useMemo(() => currentMonth, [currentMonth]);

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
    setCurrentYear(2026);
    setCurrentMonth(6);
  };

  return (
    <section
      aria-label="월간 캘린더"
      className="flex mt-token-m h-[1000px] w-[898px] flex-col overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m shrink-0"
    >
      <div className="relative ml-6 mt-8 flex h-[936px] w-[834px] flex-col items-start gap-token-l">
        <header className="inline-flex items-end gap-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-token-s bg-btn-quaternary text-text-strong">
            <Calendar className="h-6 w-6" />
          </div>
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
                <ChevronLeft className="h-6 w-6" />
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
                <ChevronRight className="h-6 w-6" />
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
                    weekIndex === 0 && day.day === 4 && day.monthOffset === 0;

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
