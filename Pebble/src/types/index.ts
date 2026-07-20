export type ScheduleBase = {
  id: string;
  title: string;
  start: string;
  end?: string;
  accent: string;
  rowWidthClass: string;
};

export type TaskItem = ScheduleBase;

export type MilestoneItem = ScheduleBase & {
  tasks?: TaskItem[];
};

export type ScheduleItem = MilestoneItem;

export type Category = {
  id: string;
  title: string;
  accent: string;
  themeBase: string;
  themeMid: string;
  themeLight: string;
  imageUrl?: string;
  items: MilestoneItem[];
  tasks?: TaskItem[];
};
