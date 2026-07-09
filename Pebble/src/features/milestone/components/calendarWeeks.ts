import { type CalendarDay, type CalendarWeek } from "./types";
import { getJuneEventLayout } from "./calendarEventLayout";

export const generateWeeks = (
  year: number,
  month: number,
  isSidebarOpen: boolean,
): CalendarWeek[] => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const weeks: CalendarWeek[] = [];
  let currentDay = 1;
  let nextMonthDay = 1;

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const days: CalendarDay[] = [];

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (weekIndex === 0 && dayOfWeek < startDayOfWeek) {
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
