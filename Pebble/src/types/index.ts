export type ScheduleDateFields = {
  start: string;
  end?: string;
  dates?: string[];
};

export type ScheduleEntityBase = ScheduleDateFields & {
  id: string;
  title: string;
};

export type ScheduleStyleFields = {
  accent?: string;
  rowWidthClass?: string;
};

export type TaskItem = ScheduleEntityBase &
  ScheduleStyleFields & {
    itemType?: "task";
    tasks?: never;
  };

export type MilestoneItem = ScheduleEntityBase &
  ScheduleStyleFields & {
    itemType?: "milestone";
    tasks?: TaskItem[];
  };

export type ScheduleItem = MilestoneItem | TaskItem;

export type Category = {
  id: string;
  title: string;
  accent: string;
  themeBase: string;
  themeMid: string;
  themeLight: string;
  themeTextOnMid?: string;
  themeTextOnLight?: string;
  imageUrl?: string;
  items: MilestoneItem[];
  tasks?: TaskItem[];
};
