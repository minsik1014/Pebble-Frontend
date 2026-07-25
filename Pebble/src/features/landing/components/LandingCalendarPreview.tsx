// src/features/landing/components/LandingCalendarPreview.tsx

import BellOutlineIcon from '@/assets/icons/bell-outline no-dot.svg?react';
import CardViewIcon from '@/assets/icons/Card-view.svg?react';
import CalendarOutlineIcon from '@/assets/icons/calendar-outline.svg?react';
import ChevronDownIcon from '@/assets/icons/chevron-down.svg?react';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';
import ListViewIcon from '@/assets/icons/List-view.svg?react';
import SettingsOutlineIcon from '@/assets/icons/settings-outline.svg?react';
import SidebarOpenIcon from '@/assets/icons/sidebar-open.svg?react';
import SocialOutlineIcon from '@/assets/icons/social-outline.svg?react';
import UserOutlineIcon from '@/assets/icons/user-outline.svg?react';

import calendarBgEllipse1 from '@/assets/images/landing/hero-calendar-bg-ellipse-1.svg';
import calendarBgEllipse2 from '@/assets/images/landing/hero-calendar-bg-ellipse-2.svg';
import calendarBgEllipse4 from '@/assets/images/landing/hero-calendar-bg-ellipse-4.svg';
import calendarBgEllipse5 from '@/assets/images/landing/hero-calendar-bg-ellipse-5.svg';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const calendarDates = [
  { day: 31, currentMonth: false, type: 'sunday' },
  { day: 1, currentMonth: true, type: 'weekday' },
  { day: 2, currentMonth: true, type: 'weekday' },
  { day: 3, currentMonth: true, type: 'weekday' },
  { day: 4, currentMonth: true, type: 'today' },
  { day: 5, currentMonth: true, type: 'weekday' },
  { day: 6, currentMonth: true, type: 'saturday' },

  { day: 7, currentMonth: true, type: 'sunday' },
  { day: 8, currentMonth: true, type: 'weekday' },
  { day: 9, currentMonth: true, type: 'weekday' },
  { day: 10, currentMonth: true, type: 'weekday' },
  { day: 11, currentMonth: true, type: 'weekday' },
  { day: 12, currentMonth: true, type: 'weekday' },
  { day: 13, currentMonth: true, type: 'saturday' },

  { day: 14, currentMonth: true, type: 'sunday' },
  { day: 15, currentMonth: true, type: 'weekday' },
  { day: 16, currentMonth: true, type: 'weekday' },
  { day: 17, currentMonth: true, type: 'weekday' },
  { day: 18, currentMonth: true, type: 'weekday' },
  { day: 19, currentMonth: true, type: 'weekday' },
  { day: 20, currentMonth: true, type: 'saturday' },

  { day: 21, currentMonth: true, type: 'sunday' },
  { day: 22, currentMonth: true, type: 'weekday' },
  { day: 23, currentMonth: true, type: 'weekday' },
  { day: 24, currentMonth: true, type: 'weekday' },
  { day: 25, currentMonth: true, type: 'weekday' },
  { day: 26, currentMonth: true, type: 'weekday' },
  { day: 27, currentMonth: true, type: 'saturday' },

  { day: 28, currentMonth: true, type: 'sunday' },
  { day: 29, currentMonth: true, type: 'weekday' },
  { day: 30, currentMonth: true, type: 'weekday' },
  { day: 1, currentMonth: false, type: 'weekday' },
  { day: 2, currentMonth: false, type: 'weekday' },
  { day: 3, currentMonth: false, type: 'weekday' },
  { day: 4, currentMonth: false, type: 'saturday' },
];

const sidebarCategories = [
  { name: '사이드 프로젝트', color: '#8B84F2' },
  { name: '행사 준비', color: '#FFDD47' },
  { name: '자격증 시험', color: '#00CEF5' },
];

const schedules = [
  {
    title: '강의 복습',
    left: 156.43,
    top: 29,
    width: 73.13,
    backgroundColor: '#DAF4FF',
    barColor: '#00CEF5',
    textColor: '#003B48',
  },
  {
    title: '1차 MVP 완성',
    left: 78.21,
    top: 130.88,
    width: 309.5,
    backgroundColor: '#B9B5F7',
    barColor: '#8B84F2',
    textColor: '#302A73',
  },
  {
    title: '계획서 작성',
    left: 391.5,
    top: 130.88,
    width: 73.13,
    backgroundColor: '#B9B5F7',
    barColor: '#8B84F2',
    textColor: '#302A73',
  },
  {
    title: '핵심 화면 정리',
    left: 78.21,
    top: 151.88,
    width: 151,
    backgroundColor: '#DAD9FB',
    barColor: '#8B84F2',
    textColor: '#302A73',
  },
  {
    title: '캘린더 연결',
    left: 234,
    top: 151.88,
    width: 105,
    backgroundColor: '#DAD9FB',
    barColor: '#8B84F2',
    textColor: '#302A73',
  },
  {
    title: '학원',
    left: 78.21,
    top: 172.88,
    width: 73.13,
    backgroundColor: '#DAF4FF',
    barColor: '#00CEF5',
    textColor: '#003B48',
  },
  {
    title: '참여자 모집',
    left: 0,
    top: 232.75,
    width: 230,
    backgroundColor: '#FFEFAD',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    title: '장소 예약',
    left: 234,
    top: 232.75,
    width: 151,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    title: '참가 신청 오픈',
    left: 0,
    top: 253.75,
    width: 73.13,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    title: '참석 인원 확인',
    left: 156.43,
    top: 253.75,
    width: 73.13,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    title: '리허설',
    left: 0,
    top: 334.63,
    width: 73.13,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
];

function CalendarPreviewBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <img
        src={calendarBgEllipse1}
        alt=""
        className="absolute left-[0px] top-[-156px] h-[653px] w-[486px] object-contain"
      />

      <img
        src={calendarBgEllipse2}
        alt=""
        className="absolute left-[375px] top-[-156px] h-[789px] w-[788px] object-contain"
      />

      <img
        src={calendarBgEllipse5}
        alt=""
        className="absolute left-[0px] top-[95px] h-[667.885px] w-[668.41px] object-contain"
      />

      <img
        src={calendarBgEllipse4}
        alt=""
        className="absolute left-[375px] top-[95px] h-[667.885px] w-[668.41px] object-contain"
      />
    </div>
  );
}

function MenuIconArea({
  children,
  selected = false,
}: {
  children: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <span
      className={[
        'flex size-[27.5px] items-center justify-center rounded-token-s',
        selected ? 'bg-btn-primary text-white' : 'text-text-strong',
      ].join(' ')}
    >
      {children}
    </span>
  );
}

function MenuBar() {
  const iconClassName = 'size-[15px] [&_*]:stroke-current';
  const selectedIconClassName = 'size-[15px] text-white [&_*]:stroke-current';

  return (
    <nav className="absolute left-0 top-0 flex h-[625px] w-[52.5px] bg-fill-inverse px-[12.5px] py-[20px]">
      <div className="flex h-[585px] w-[27.5px] flex-col items-center justify-between">
        <div className="flex h-[80px] w-[27.5px] flex-col items-center gap-[25px]">
          <MenuIconArea>
            <SidebarOpenIcon className={iconClassName} aria-hidden="true" />
          </MenuIconArea>

          <MenuIconArea>
            <BellOutlineIcon className={iconClassName} aria-hidden="true" />
          </MenuIconArea>
        </div>

        <div className="flex h-[132.5px] w-[27.5px] flex-col items-center gap-[25px]">
          <MenuIconArea>
            <SocialOutlineIcon className={iconClassName} aria-hidden="true" />
          </MenuIconArea>

          <MenuIconArea selected>
            <CalendarOutlineIcon
              className={selectedIconClassName}
              aria-hidden="true"
            />
          </MenuIconArea>

          <MenuIconArea>
            <UserOutlineIcon className={iconClassName} aria-hidden="true" />
          </MenuIconArea>
        </div>

        <MenuIconArea>
          <SettingsOutlineIcon className={iconClassName} aria-hidden="true" />
        </MenuIconArea>
      </div>
    </nav>
  );
}

function SegmentControl() {
  const iconClassName = 'size-[15px] [&_*]:stroke-current';

  return (
    <div className="flex h-[30px] w-[67.5px] items-center gap-[2.5px] rounded-token-s bg-btn-quaternary p-token-xs">
      <span className="flex h-[25px] w-[30px] items-center justify-center rounded-[5.63px] bg-fill-inverse text-text-strong shadow-[0_0_2.5px_rgba(23,23,23,0.1)]">
        <CardViewIcon className={iconClassName} aria-hidden="true" />
      </span>

      <span className="flex h-[25px] w-[30px] items-center justify-center rounded-[5.63px] text-text-secondary">
        <ListViewIcon className={iconClassName} aria-hidden="true" />
      </span>
    </div>
  );
}

function CategoryCard({ name, color }: { name: string; color: string }) {
  const iconClassName = 'size-[15px] [&_*]:stroke-current';

  return (
    <div className="flex h-[42.5px] w-[220px] items-center justify-between rounded-token-m bg-fill-inverse py-token-m pl-token-l pr-token-m shadow-[0_0_12px_rgba(23,23,23,0.05)]">
      <div className="flex h-[25px] w-[145px] items-center gap-[7.5px]">
        <span
          className="h-[25px] w-[5px] shrink-0 rounded-token-xs"
          style={{ backgroundColor: color }}
        />
        <span className="max-w-[157.5px] truncate text-[12.5px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
          {name}
        </span>
      </div>

      <div className="flex h-[27.5px] w-[55px] items-center text-text-secondary">
        <span className="flex size-[27.5px] items-center justify-center rounded-token-s">
          <ChevronDownIcon className={iconClassName} aria-hidden="true" />
        </span>
        <span className="flex size-[27.5px] items-center justify-center rounded-token-s">
          <EyeOnIcon className={iconClassName} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="absolute left-[52.5px] top-0 h-[625px] w-[245px] rounded-r-[20px] border-l-[0.63px] border-[#F5F5F5] bg-fill-inverse">
      <div className="flex h-[62.5px] w-[245px] items-center justify-between px-[12.5px] pb-[12.5px] pt-[20px]">
        <strong className="text-[20px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          6월
        </strong>

        <SegmentControl />
      </div>

      <div className="absolute left-0 top-[62.5px] flex h-[562.5px] w-[245px] flex-col gap-[12.5px] px-[12.5px] pb-[7.5px] pt-[2.5px]">
        {sidebarCategories.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            color={category.color}
          />
        ))}

        <button
          type="button"
          tabIndex={-1}
          className="flex h-[30px] w-[219.38px] items-center justify-center rounded-token-s bg-btn-primary text-[8.75px] font-medium leading-[130%] tracking-[-0.01em] text-text-onFill"
        >
          추가하기
        </button>
      </div>
    </div>
  );
}

function SidebarPreview() {
  return (
    <aside className="absolute left-[7.5px] top-[7.5px] h-[625px] w-[297.5px] overflow-hidden rounded-[12.5px] bg-fill-inverse shadow-[0_0_17.5px_rgba(23,23,23,0.05)]">
      <MenuBar />
      <SidebarContent />
    </aside>
  );
}

function CalendarHeader() {
  const iconClassName = 'size-[15px] [&_*]:stroke-current';

  return (
    <div className="flex h-[27.5px] w-[212.5px] items-center gap-[17.5px]">
      <strong className="w-[92px] text-[17.5px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
        2026년 6월
      </strong>

      <div className="flex h-[27.5px] w-[103px] items-center gap-[5px]">
        <span className="flex size-[27.5px] items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-secondary">
          <ChevronLeftIcon className={iconClassName} aria-hidden="true" />
        </span>

        <span className="flex h-[27.5px] min-w-[33px] items-center justify-center rounded-token-infinite bg-btn-quaternary px-[7.5px]">
          <span className="text-[10px] font-semibold leading-[150%] tracking-[-0.01em] text-text-secondary">
            오늘
          </span>
        </span>

        <span className="flex size-[27.5px] items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-secondary">
          <ChevronRightIcon className={iconClassName} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function WeekdayHeader() {
  return (
    <div className="absolute left-0 top-[40px] grid h-[28.125px] w-[547.5px] grid-cols-7">
      {weekdays.map((weekday, index) => (
        <div key={weekday} className="relative h-[28.125px]">
          <span
            className={[
              'absolute left-[5px] top-[5px] text-[11.25px] font-medium leading-[150%] tracking-[-0.01em]',
              index === 0
                ? 'text-[#FC4C46]'
                : index === 6
                  ? 'text-[#3059FF]'
                  : 'text-text-secondary',
            ].join(' ')}
          >
            {weekday}
          </span>
        </div>
      ))}
    </div>
  );
}

function getDateColor(date: (typeof calendarDates)[number]) {
  if (date.type === 'today') return 'text-white';
  if (date.type === 'sunday' && date.currentMonth) return 'text-[#FC4C46]';
  if (date.type === 'sunday' && !date.currentMonth) return 'text-[#FEA68F]';
  if (date.type === 'saturday') return 'text-[#3059FF]';
  if (!date.currentMonth) return 'text-text-teritary';
  return 'text-text-strong';
}

function MonthGrid() {
  return (
    <div className="absolute left-0 top-[80.625px] h-[509.375px] w-[547.5px]">
      <div className="grid h-full w-full grid-cols-7 grid-rows-5">
        {calendarDates.map((date, index) => (
          <div key={`${date.day}-${index}`} className="relative">
            {date.type === 'today' ? (
              <span className="absolute left-[2px] top-[1px] flex size-[22px] items-center justify-center rounded-full bg-btn-primary text-[11.25px] font-semibold leading-[150%] tracking-[-0.01em] text-white">
                {date.day}
              </span>
            ) : (
              <span
                className={[
                  'absolute left-[5px] top-[5px] text-[11.25px] font-semibold leading-[150%] tracking-[-0.01em]',
                  getDateColor(date),
                ].join(' ')}
              >
                {date.day}
              </span>
            )}
          </div>
        ))}
      </div>

      {schedules.map((schedule) => (
        <div
          key={`${schedule.title}-${schedule.left}-${schedule.top}`}
          className="absolute h-[16px] overflow-hidden rounded-token-xs"
          style={{
            left: schedule.left,
            top: schedule.top,
            width: schedule.width,
            backgroundColor: schedule.backgroundColor,
          }}
        >
          <span
            className="absolute left-0 top-1/2 h-[14.375px] w-[2.5px] -translate-y-1/2 rounded-token-xs"
            style={{ backgroundColor: schedule.barColor }}
          />

          <span
            className="absolute left-[6.25px] top-1/2 max-h-[13.13px] w-[58.125px] -translate-y-1/2 truncate text-[8.13px] font-medium leading-[130%] tracking-[-0.01em]"
            style={{ color: schedule.textColor }}
          >
            {schedule.title}
          </span>
        </div>
      ))}
    </div>
  );
}

function CalendarBoardPreview() {
  return (
    <section className="absolute left-[315px] top-[7.5px] h-[625px] w-[577.5px] overflow-hidden rounded-[12.5px] bg-fill-inverse shadow-[0_0_17.5px_rgba(23,23,23,0.05)]">
      <div className="absolute left-[15px] top-[20px] h-[585px] w-[547.5px]">
        <CalendarHeader />
        <WeekdayHeader />
        <MonthGrid />
      </div>
    </section>
  );
}

export function LandingCalendarPreview() {
  return (
    <div className="pointer-events-none absolute left-[200px] top-[734px] h-[640px] w-[1040px] overflow-hidden rounded-token-l bg-fill-inverse shadow-[0_0_28px_rgba(23,23,23,0.05)]">
      <CalendarPreviewBackground />

      <div className="absolute left-[70px] top-[64px] z-10 h-[640px] w-[900px]">
        <SidebarPreview />
        <CalendarBoardPreview />
      </div>
    </div>
  );
}