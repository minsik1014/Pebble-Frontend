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
