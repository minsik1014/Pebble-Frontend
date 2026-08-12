import type { CSSProperties } from 'react';

import { type DateType, type DayStatus } from '@/hooks/useScheduleDatePicker';
import { getReadableCategoryTextColor } from '@/utils/categoryColorTheme';

type ScheduleDatePickerVariant = 'milestone' | 'task';

type ScheduleDatePickerProps = {
  variant: ScheduleDatePickerVariant;
  dateType: DateType;
  onDateTypeChange: (dateType: DateType) => void;
  currentYear: number;
  currentMonth: number;
  daysInMonth: number;
  firstDay: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (day: number) => void;
  getDayStatus: (day: number) => DayStatus;
  themeBaseColor?: string;
  themeMidColor?: string;
  themeLightColor?: string;
  disabled?: boolean;
};

const DATE_TYPES: DateType[] = ['하루', '기간', '다중'];
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const DATE_TYPE_DESCRIPTIONS: Record<DateType, string> = {
  하루: '특정한 날만',
  기간: '시작부터 끝까지',
  다중: '여러 날을 골라 담아',
};

export const ScheduleDatePicker = ({
  variant,
  dateType,
  onDateTypeChange,
  currentYear,
  currentMonth,
  daysInMonth,
  firstDay,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  getDayStatus,
  themeBaseColor = '#171717',
  themeMidColor = '#171717',
  themeLightColor = 'rgba(23, 23, 23, 0.05)',
  disabled = false,
}: ScheduleDatePickerProps) => {
  const isTaskVariant = variant === 'task';
  const daySizeClass = 'size-12';
  const wrapperHeightClass = 'h-14';

  const getSelectedColor = (type: DateType) =>
    type === '다중' ? themeMidColor : themeBaseColor;

  const getSelectedTextColor = (type: DateType) =>
    type === '다중'
      ? getReadableCategoryTextColor(themeBaseColor, getSelectedColor(type))
      : '#ffffff';

  const isBlackCategoryColor =
    themeBaseColor.trim().toLowerCase() === '#171717';

  const getSelectedDateTypeButtonStyle = (type: DateType) =>
    ({
      backgroundColor: isBlackCategoryColor
        ? 'rgb(var(--button-primary))'
        : getSelectedColor(type),
      color: isBlackCategoryColor
        ? 'rgb(var(--text-on-fill))'
        : getSelectedTextColor(type),
    }) as CSSProperties;

  const rangeBackgroundStyle = {
    '--schedule-range-color': themeLightColor,
  } as CSSProperties;

  const getTypeButtonClass = (type: DateType) => {
    const baseClass =
      'group relative flex h-[73px] flex-1 flex-col items-start justify-center gap-1 overflow-hidden rounded-token-s px-5 py-3 transition-colors';

    const activeClass = 'text-text-onFill';

    const inactiveClass = isTaskVariant
      ? 'bg-btn-quaternary text-text-strong'
      : 'bg-fill-surface text-text-strong dark:bg-btn-quaternary';

    return `${baseClass} ${dateType === type ? activeClass : inactiveClass}`;
  };

  const getTypeButtonOverlayClass = (type: DateType) => {
    if (disabled) {
      return '';
    }

    return dateType === type
      ? 'group-hover:bg-[rgba(250,250,250,0.25)] group-active:bg-[rgba(250,250,250,0.4)]'
      : 'group-hover:bg-[rgba(23,23,23,0.05)] group-active:bg-[rgba(23,23,23,0.1)]';
  };

  const getDayButtonClass = (status: DayStatus) => {
    const baseClass = `${daySizeClass} rounded-[12px] flex items-center justify-center text-body-01-m tracking-[-0.18px] transition-colors z-10 relative`;

    if (
      status === 'selected' ||
      status === 'range-start' ||
      status === 'range-end'
    ) {
      return baseClass;
    }

    if (status === 'today') {
      return `${baseClass} bg-fill-surface text-text-strong`;
    }

    return `${baseClass} text-text-strong hover:bg-fill-surface`;
  };

  const calendarCells: Array<number | null> = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const calendarWeeks = Array.from(
    { length: Math.ceil(calendarCells.length / 7) },
    (_, weekIndex) => {
      const week = calendarCells.slice(weekIndex * 7, weekIndex * 7 + 7);

      return [...week, ...Array.from({ length: 7 - week.length }, () => null)];
    },
  );

  const renderWeekRangeBackground = (week: Array<number | null>) => {
    if (disabled || dateType !== '기간') {
      return null;
    }

    const rangeCells = week
      .map((day, index) => ({
        index,
        status: day === null ? 'none' : getDayStatus(day),
      }))
      .filter(({ status }) =>
        ['range-start', 'range-end', 'in-range'].includes(status),
      );

    if (rangeCells.length === 0) {
      return null;
    }

    const firstRangeCell = rangeCells[0];
    const lastRangeCell = rangeCells[rangeCells.length - 1];
    const startColumn =
      firstRangeCell.index + (firstRangeCell.status === 'range-start' ? 0.5 : 0);
    const endColumn =
      lastRangeCell.index + (lastRangeCell.status === 'range-end' ? 0.5 : 1);

    return (
      <div
        className="schedule-date-range-segment pointer-events-none absolute top-1/2 h-12 -translate-y-1/2 rounded-[12px]"
        style={{
          ...rangeBackgroundStyle,
          left: `${(startColumn / 7) * 100}%`,
          width: `${((endColumn - startColumn) / 7) * 100}%`,
        }}
      />
    );
  };

  return (
    <>
      <div className={`flex w-full gap-3 ${isTaskVariant ? 'mt-2' : ''}`}>
        {DATE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onDateTypeChange(type)}
            disabled={disabled}
            className={`${getTypeButtonClass(type)} disabled:cursor-not-allowed disabled:opacity-50`}
            style={
              dateType === type
                ? getSelectedDateTypeButtonStyle(type)
                : undefined
            }
          >
            <span
              className={`pointer-events-none absolute inset-0 transition-colors ${getTypeButtonOverlayClass(
                type,
              )}`}
              aria-hidden="true"
            />

            <span
              className={
                isTaskVariant
                  ? `relative z-10 text-[16px] font-medium leading-[1.5] tracking-[-0.16px] ${
                      dateType === type ? '' : 'text-text-strong'
                    }`
                  : `relative z-10 text-body-02-m ${
                      dateType === type ? '' : 'text-text-strong'
                    }`
              }
              style={
                dateType === type
                  ? { color: getSelectedDateTypeButtonStyle(type).color }
                  : undefined
              }
            >
              {type}
            </span>

            <span
              className={
                isTaskVariant
                  ? `relative z-10 text-[14px] font-medium leading-[1.5] tracking-[-0.14px] ${
                      dateType === type ? '' : 'text-text-secondary'
                    }`
                  : `relative z-10 text-[14px] font-medium leading-[1.5] tracking-[-0.14px] ${
                      dateType === type ? '' : 'text-text-secondary'
                    }`
              }
              style={
                dateType === type
                  ? { color: getSelectedDateTypeButtonStyle(type).color }
                  : undefined
              }
            >
              {DATE_TYPE_DESCRIPTIONS[type]}
            </span>
          </button>
        ))}
      </div>

      <div
        className={`flex w-full flex-col gap-4 ${isTaskVariant ? 'mt-3' : ''}`}
      >
        <div
          className={
            isTaskVariant
              ? 'relative flex w-full items-center justify-center'
              : 'flex items-center gap-2'
          }
        >
          {!isTaskVariant && (
            <span className="mr-2 text-[20px] font-bold tracking-[-0.2px] text-text-strong">
              {currentYear}년 {currentMonth + 1}월
            </span>
          )}

          <button
            type="button"
            onClick={onPrevMonth}
            disabled={disabled}
            className={`${
              isTaskVariant ? 'absolute left-[35%]' : ''
            } flex h-8 w-8 items-center justify-center rounded-full bg-fill-surface text-text-strong transition-[background-color,filter] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-fill-surface dark:bg-btn-quaternary dark:text-text-secondary dark:hover:bg-btn-pressed dark:disabled:hover:bg-btn-quaternary`}
            aria-label="이전 달"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isTaskVariant && (
            <span className="text-[20px] font-semibold tracking-[-0.2px] text-text-strong">
              {currentYear}년 {currentMonth + 1}월
            </span>
          )}

          <button
            type="button"
            onClick={onNextMonth}
            disabled={disabled}
            className={`${
              isTaskVariant ? 'absolute right-[35%]' : ''
            } flex h-8 w-8 items-center justify-center rounded-full bg-fill-surface text-text-strong transition-[background-color,filter] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-fill-surface dark:bg-btn-quaternary dark:text-text-secondary dark:hover:bg-btn-pressed dark:disabled:hover:bg-btn-quaternary`}
            aria-label="다음 달"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className={`flex w-full flex-col gap-4 ${isTaskVariant ? 'px-4' : ''}`}>
          <div className="grid w-full grid-cols-7 text-center">
            {WEEK_DAYS.map((day) => (
              <span
                key={day}
                className="text-body-02-m tracking-[-0.16px] text-text-teritary"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="flex w-full flex-col gap-4">
            {calendarWeeks.map((week, weekIndex) => (
              <div
                key={`week-${weekIndex}`}
                className={`relative grid w-full grid-cols-7 ${wrapperHeightClass}`}
              >
                {renderWeekRangeBackground(week)}

                {week.map((day, dayIndex) =>
                  day === null ? (
                    <div key={`empty-${weekIndex}-${dayIndex}`} />
                  ) : (
                    <div
                      key={day}
                      className="relative flex w-full items-center justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => onDateClick(day)}
                        disabled={disabled}
                        className={`${getDayButtonClass(
                          disabled ? 'none' : getDayStatus(day),
                        )} disabled:cursor-not-allowed disabled:opacity-50`}
                        style={
                          !disabled &&
                          ['selected', 'range-start', 'range-end'].includes(
                            getDayStatus(day),
                          )
                            ? {
                                backgroundColor: getSelectedColor(dateType),
                                color: getSelectedTextColor(dateType),
                              }
                            : undefined
                        }
                      >
                        {day}
                      </button>
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
