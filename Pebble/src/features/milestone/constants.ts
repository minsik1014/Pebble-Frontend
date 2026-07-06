export type ScheduleItem = {
  id: string;
  title: string;
  start: string;
  end?: string;
  accent: string;
  rowWidthClass: string;
  tasks?: ScheduleItem[];
};

export type Category = {
  id: string;
  title: string;
  accent: string;
  themeBase: string;
  themeMid: string;
  themeLight: string;
  items: ScheduleItem[];
};

export const categories: Category[] = [
  {
    id: "expo",
    title: "EXPO",
    accent: "#00cef5",
    themeBase: "bg-theme-6-base",
    themeMid: "bg-theme-6-mid",
    themeLight: "bg-theme-6-light",
    items: [
      {
        id: "expo-1",
        title: "계획서 제출",
        start: "6/7",
        end: "6/9",
        accent: "#9be6ff",
        rowWidthClass: "w-80",
      },
      {
        id: "expo-2",
        title: "EXPO 계획서 작성하기",
        start: "6/10",
        accent: "#daf4ff",
        rowWidthClass: "w-[308px]",
      },
    ],
  },
  {
    id: "final-exam",
    title: "기말고사",
    accent: "#ffdd47",
    themeBase: "bg-theme-4-base",
    themeMid: "bg-theme-4-mid",
    themeLight: "bg-theme-4-light",
    items: [
      {
        id: "final-1",
        title: "운영시스템 공부",
        start: "6/14",
        end: "6/16",
        accent: "#fff6d5",
        rowWidthClass: "w-80",
      },
      {
        id: "final-2",
        title: "운영시스템 시험",
        start: "6/17",
        accent: "#fff6d5",
        rowWidthClass: "w-80",
      },
    ],
  },
  {
    id: "startup-contest",
    title: "창업 공모전",
    accent: "#ff7580",
    themeBase: "bg-theme-3-base",
    themeMid: "bg-theme-3-mid",
    themeLight: "bg-theme-3-light",
    items: [
      {
        id: "startup-1",
        title: "백엔드 프로젝트",
        start: "6/8",
        end: "6/11",
        accent: "#ffc0c3",
        rowWidthClass: "w-80",
        tasks: [
          {
            id: "startup-task-1",
            title: "MVP 페이지 구현",
            start: "6/8",
            end: "6/9",
            accent: "#ffeced",
            rowWidthClass: "w-[308px]",
          },
          {
            id: "startup-task-2",
            title: "백엔드 보고서 제출",
            start: "6/17",
            accent: "#ffeced",
            rowWidthClass: "w-[308px]",
          }
        ]
      },
      {
        id: "startup-2",
        title: "MVP 페이지 구현",
        start: "6/8",
        end: "6/9",
        accent: "#ffeced",
        rowWidthClass: "w-[308px]",
      },
      {
        id: "startup-3",
        title: "백엔드 보고서 제출",
        start: "6/17",
        accent: "#ffeced",
        rowWidthClass: "w-[308px]",
      },
      {
        id: "startup-4",
        title: "창업실무 보고서",
        start: "6/12",
        accent: "#ffc0c3",
        rowWidthClass: "w-80",
      },
    ],
  },
];
