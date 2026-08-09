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
      : 'bg-fill-surface text-text-strong';

    return `${baseClass} ${dateType === type ? activeClass : inactiveClass}`;
  };

  const getTypeButtonOverlayClass = (type: DateType) =>
    dateType === type
      ? 'group-hover:bg-[rgba(250,250,250,0.25)] group-active:bg-[rgba(250,250,250,0.4)]'
      : 'group-hover:bg-[rgba(23,23,23,0.05)] group-active:bg-[rgba(23,23,23,0.1)]';

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

  const renderRangeBackground = (status: DayStatus) => {
    if (status === 'range-start') {
      return (
        <div
          className="schedule-date-range-segment absolute -right-px top-0 h-full w-[calc(50%+1px)]"
          style={rangeBackgroundStyle}
        />
      );
    }

    if (status === 'range-end') {
      return (
        <div
          className="schedule-date-range-segment absolute -left-px top-0 h-full w-[calc(50%+1px)]"
          style={rangeBackgroundStyle}
        />
      );
    }

    if (status === 'in-range') {
      return (
        <div
          className="schedule-date-range-segment absolute -inset-x-px inset-y-0"
          style={rangeBackgroundStyle}
        />
      );
    }

    return null;
  };

  return (
    <>
      <div className={`flex w-full gap-3 ${isTaskVariant ? 'mt-2' : ''}`}>
        {DATE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onDateTypeChange(type)}
            className={getTypeButtonClass(type)}
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
            className={`${
              isTaskVariant ? 'absolute left-[35%]' : ''
            } flex h-8 w-8 items-center justify-center rounded-full bg-fill-surface text-text-strong transition-[background-color,filter] hover:bg-black/5 dark:bg-btn-quaternary dark:text-text-secondary dark:hover:bg-btn-pressed`}
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
            className={`${
              isTaskVariant ? 'absolute right-[35%]' : ''
            } flex h-8 w-8 items-center justify-center rounded-full bg-fill-surface text-text-strong transition-[background-color,filter] hover:bg-black/5 dark:bg-btn-quaternary dark:text-text-secondary dark:hover:bg-btn-pressed`}
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

        <div
          className={`grid w-full grid-cols-7 gap-y-4 text-center ${
            isTaskVariant ? 'px-4' : ''
          }`}
        >
          {WEEK_DAYS.map((day) => (
            <span
              key={day}
              className="text-body-02-m tracking-[-0.16px] text-text-teritary"
            >
              {day}
            </span>
          ))}

          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const status = getDayStatus(day);

            return (
              <div
                key={day}
                className={`relative flex w-full ${wrapperHeightClass} items-center justify-center overflow-visible`}
              >
                {renderRangeBackground(status)}

                <button
                  type="button"
                  onClick={() => onDateClick(day)}
                  className={getDayButtonClass(status)}
                  style={
                    status === 'selected' ||
                    status === 'range-start' ||
                    status === 'range-end'
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
            );
          })}
        </div>
      </div>
    </>
  );
};