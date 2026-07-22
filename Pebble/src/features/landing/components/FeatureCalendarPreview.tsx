import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const weeks = [
  [31, 1, 2, 3, 4],
  [7, 8, 9, 10, 11],
  [14, 15, 16, 17, 18],
  [21, 22, 23, 24, 25],
  [28, 29, 30, 1, 2],
];

const previewSchedules = [
  {
    title: '강의 복습',
    left: 167,
    top: 113,
    width: 88,
    color: '#DAF4FF',
  },
  {
    title: '1차 MVP 완성',
    left: 101,
    top: 217,
    width: 286,
    color: '#B9B5F7',
  },
  {
    title: '핵심 화면 정리',
    left: 101,
    top: 240,
    width: 180,
    color: '#DAD9FB',
  },
  {
    title: '캘린더 연결',
    left: 288,
    top: 240,
    width: 120,
    color: '#DAD9FB',
  },
  {
    title: '학원',
    left: 101,
    top: 263,
    width: 88,
    color: '#DAF4FF',
  },
  {
    title: '참여자 모집',
    left: 101,
    top: 342,
    width: 287,
    color: '#FFEFAD',
  },
  {
    title: '장소 예약',
    left: 394,
    top: 342,
    width: 118,
    color: '#FFF6D5',
  },
  {
    title: '참가 신청 오픈',
    left: 101,
    top: 365,
    width: 107,
    color: '#FFF6D5',
  },
  {
    title: '참석 인원 확인',
    left: 260,
    top: 365,
    width: 128,
    color: '#FFF6D5',
  },
];

export function FeatureCalendarPreview() {
  return (
    <>
      <div className="absolute left-[701px] top-[114px] h-[607px] w-[789px] opacity-20">
        <CalendarMock isBackground />
      </div>

      <div className="absolute left-[719px] top-[130px] h-[364px] w-[421px] overflow-hidden rounded-token-m bg-fill-inverse shadow-shadow-m">
        <CalendarMock />
      </div>
    </>
  );
}

function CalendarMock({ isBackground = false }: { isBackground?: boolean }) {
  return (
    <div
      className={[
        'relative h-full w-full bg-fill-inverse',
        isBackground ? 'scale-[1.45] origin-top-left' : '',
      ].join(' ')}
    >
      <div className="absolute left-[38px] top-[26px] flex items-center gap-[8px]">
        <strong className="text-[16px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          2026년 6월
        </strong>

        <span className="flex size-[24px] items-center justify-center rounded-full bg-[#F5F5F5] text-text-secondary">
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </span>

        <span className="flex h-[24px] items-center rounded-full bg-[#F5F5F5] px-[10px] text-[10px] font-medium text-text-secondary">
          오늘
        </span>

        <span className="flex size-[24px] items-center justify-center rounded-full bg-[#F5F5F5] text-text-secondary">
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </span>
      </div>

      <div className="absolute left-[42px] top-[78px] grid w-[340px] grid-cols-5 text-center text-[10px] font-medium">
        {weekdays.slice(0, 5).map((weekday, index) => (
          <span
            key={weekday}
            className={index === 0 ? 'text-[#FC4C46]' : 'text-text-secondary'}
          >
            {weekday}
          </span>
        ))}
      </div>

      <div className="absolute left-[42px] top-[106px] grid w-[340px] grid-cols-5 gap-y-[62px] text-center text-[10px] font-semibold text-text-strong">
        {weeks.flat().map((day, index) => {
          const isSunday = index % 5 === 0;
          const isOtherMonth = index === 0 || index >= 23;
          const isToday = day === 4 && index === 3;

          return (
            <span
              key={`${index}-${day}`}
              className={[
                'flex justify-center',
                isSunday ? 'text-[#FC4C46]' : '',
                isOtherMonth ? 'opacity-40' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'flex size-[20px] items-center justify-center',
                  isToday
                    ? 'rounded-full bg-[#171717] text-white opacity-100'
                    : '',
                ].join(' ')}
              >
                {day}
              </span>
            </span>
          );
        })}
      </div>

      {previewSchedules.map((schedule) => (
        <div
          key={`${schedule.title}-${schedule.left}-${schedule.top}`}
          className="absolute h-[16px] truncate rounded-[3px] px-[5px] text-[8px] font-medium leading-[16px] text-[#404040]"
          style={{
            left: schedule.left,
            top: schedule.top,
            width: schedule.width,
            backgroundColor: schedule.color,
          }}
        >
          {schedule.title}
        </div>
      ))}
    </div>
  );
}