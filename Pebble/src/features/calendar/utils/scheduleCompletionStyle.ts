const COMPLETED_SCHEDULE_TEXT_COLOR = "rgb(var(--text-teritary))";

export const getScheduleTextColorClass = (
  isCompleted: boolean,
  defaultClassName = "text-text-strong",
) => (isCompleted ? "text-text-teritary" : defaultClassName);

export const getScheduleTextColor = (
  isCompleted: boolean,
  defaultColor: string,
) => (isCompleted ? COMPLETED_SCHEDULE_TEXT_COLOR : defaultColor);
