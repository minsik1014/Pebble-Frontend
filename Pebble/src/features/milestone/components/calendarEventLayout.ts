type CalendarEventLayout = {
  widthClass: string;
  leftClass: string;
};

type JuneCalendarEventLayout = {
  secondWeek: {
    expoPlan: CalendarEventLayout;
    backendProject: CalendarEventLayout;
    startupReport: CalendarEventLayout;
    mvpPage: CalendarEventLayout;
    planSubmit: CalendarEventLayout;
  };
  thirdWeek: {
    operatingStudy: CalendarEventLayout;
    backendSubmit: CalendarEventLayout;
    operatingTest: CalendarEventLayout;
  };
};

export const getJuneEventLayout = (isSidebarOpen: boolean): JuneCalendarEventLayout => ({
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
