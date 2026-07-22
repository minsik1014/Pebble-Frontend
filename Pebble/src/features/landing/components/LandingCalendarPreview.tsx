const categories = [
  { title: '사이드 프로젝트', color: '#8B84F2' },
  { title: '행사 준비', color: '#FFD540' },
  { title: '자격증 시험', color: '#22D3EE' },
];

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const weeks = [
  [31, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 1, 2, 3, 4],
];

const schedules = [
  {
    title: '강의 복습',
    row: 0,
    startCol: 2,
    span: 1,
    lane: 0,
    color: '#DAF4FF',
  },
  {
    title: '1차 MVP 완성',
    row: 1,
    startCol: 1,
    span: 4,
    lane: 0,
    color: '#B9B5F7',
  },
  {
    title: '계획서 작성',
    row: 1,
    startCol: 5,
    span: 1,
    lane: 0,
    color: '#B9B5F7',
  },
  {
    title: '핵심 화면 정리',
    row: 1,
    startCol: 1,
    span: 2,
    lane: 1,
    color: '#DAD9FB',
  },
  {
    title: '캘린더 연결',
    row: 1,
    startCol: 3,
    span: 1,
    lane: 1,
    color: '#DAD9FB',
  },
  {
    title: '학원',
    row: 1,
    startCol: 1,
    span: 1,
    lane: 2,
    color: '#DAF4FF',
  },
  {
    title: '참여자 모집',
    row: 2,
    startCol: 0,
    span: 3,
    lane: 0,
    color: '#FFEFAD',
  },
  {
    title: '장소 예약',
    row: 2,
    startCol: 3,
    span: 2,
    lane: 0,
    color: '#FFF6D5',
  },
  {
    title: '참가 신청 오픈',
    row: 2,
    startCol: 0,
    span: 1,
    lane: 1,
    color: '#FFF6D5',
  },
  {
    title: '참석 인원 확인',
    row: 2,
    startCol: 2,
    span: 1,
    lane: 1,
    color: '#FFF6D5',
  },
  {
    title: '리허설',
    row: 3,
    startCol: 0,
    span: 1,
    lane: 0,
    color: '#FFF6D5',
  },
];

const PREVIEW_LEFT = 200;
const PREVIEW_TOP = 734;
const PREVIEW_WIDTH = 1040;
const PREVIEW_HEIGHT = 640;

const INNER_LEFT = 70;
const INNER_TOP = 64;
const INNER_WIDTH = 900;
const INNER_HEIGHT = 640;

const SIDEBAR_LEFT = 7.5;
const SIDEBAR_TOP = 7.5;
const SIDEBAR_WIDTH = 297.5;
const SIDEBAR_HEIGHT = 625;

const CALENDAR_LEFT = 315;
const CALENDAR_TOP = 7.5;
const CALENDAR_WIDTH = 577.5;
const CALENDAR_HEIGHT = 625;

const GRID_LEFT = 38;
const WEEKDAY_TOP = 88;
const GRID_TOP = 126;
const GRID_WIDTH = 500;
const CELL_WIDTH = GRID_WIDTH / 7;
const CELL_HEIGHT = 102;

const BAR_TOP_OFFSET = 30;
const BAR_HEIGHT = 18;
const BAR_LANE_GAP = 22;
const BAR_SIDE_PADDING = 4;

function NavIcon({ active = false }: { active?: boolean }) {
  return (
    <span
      className={[
        'flex size-8 items-center justify-center rounded-[8px]',
        active ? 'bg-[#171717]' : '',
      ].join(' ')}
    >
      <span
        className={[
          'block size-[14px] rounded-[3px] border',
          active ? 'border-white' : 'border-[#171717]',
        ].join(' ')}
      />
    </span>
  );
}

export function LandingCalendarPreview() {
  return (
    <div
      className="absolute overflow-hidden rounded-token-l bg-fill-inverse shadow-shadow-m"
      style={{
        left: PREVIEW_LEFT,
        top: PREVIEW_TOP,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
      }}
    >
      <div
        className="absolute bg-fill-inverse"
        style={{
          left: INNER_LEFT,
          top: INNER_TOP,
          width: INNER_WIDTH,
          height: INNER_HEIGHT,
        }}
      >
        <aside
          className="absolute overflow-hidden rounded-[12.5px] bg-fill-inverse shadow-[0_0_17.5px_rgba(23,23,23,0.05)]"
          style={{
            left: SIDEBAR_LEFT,
            top: SIDEBAR_TOP,
            width: SIDEBAR_WIDTH,
            height: SIDEBAR_HEIGHT,
          }}
        >
          <div className="absolute left-0 top-0 flex h-full w-[52px] flex-col items-center border-r border-[#F5F5F5]">
            <div className="mt-[28px] size-[14px] rounded-[3px] bg-[#171717]" />

            <div className="mt-[52px] flex flex-col items-center gap-[54px]">
              <span className="size-[14px] rounded-full border border-[#171717]" />
              <span className="size-[14px] rounded-full border border-[#171717]" />
            </div>

            <div className="mt-[126px]">
              <NavIcon active />
            </div>

            <div className="mt-[42px]">
              <span className="block size-[14px] rounded-full border border-[#171717]" />
            </div>

            <div className="mt-auto mb-[34px] flex flex-col items-center gap-[42px]">
              <span className="block size-[14px] rounded-full border border-[#171717]" />
              <span className="block size-[14px] rounded-[3px] border border-[#171717]" />
            </div>
          </div>

          <div className="absolute left-[68px] top-[28px] w-[218px]">
            <div className="mb-[25px] flex h-10 items-center justify-between">
              <h3 className="text-[22px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
                6월
              </h3>

              <div className="flex h-[40px] w-[68px] items-center justify-center gap-2 rounded-[10px] bg-[#F5F5F5]">
                <span className="size-[14px] rounded-[3px] border border-[#171717]" />
                <span className="h-[14px] w-[1px] bg-[#D4D4D4]" />
                <span className="h-[14px] w-[14px] border-y border-[#A3A3A3]" />
              </div>
            </div>

            <div className="flex flex-col gap-[14px]">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className="flex h-[48px] items-center justify-between rounded-[12px] bg-fill-inverse px-[12px] shadow-[0_0_17.5px_rgba(23,23,23,0.05)]"
                >
                  <div className="flex items-center gap-[10px]">
                    <span
                      className="h-[32px] w-[5px] rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-[15px] font-semibold leading-[150%] tracking-[-0.01em] text-text-strong">
                      {category.title}
                    </span>
                  </div>

                  <span className="text-[16px] text-text-secondary">⌄</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              tabIndex={-1}
              className="mt-[16px] h-[40px] w-full rounded-[8px] bg-[#171717] text-[13px] font-medium text-white"
            >
              추가하기
            </button>
          </div>
        </aside>

        <section
          className="absolute overflow-hidden rounded-[12.5px] bg-fill-inverse shadow-[0_0_17.5px_rgba(23,23,23,0.05)]"
          style={{
            left: CALENDAR_LEFT,
            top: CALENDAR_TOP,
            width: CALENDAR_WIDTH,
            height: CALENDAR_HEIGHT,
          }}
        >
          <div className="absolute left-[20px] top-[27px] flex items-center gap-[10px]">
            <h3 className="text-[22px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
              2026년 6월
            </h3>

            <span className="flex size-[28px] items-center justify-center rounded-full bg-[#F5F5F5] text-[18px] text-text-secondary">
              ‹
            </span>
            <span className="flex h-[28px] items-center rounded-full bg-[#F5F5F5] px-[12px] text-[12px] font-medium text-text-secondary">
              오늘
            </span>
            <span className="flex size-[28px] items-center justify-center rounded-full bg-[#F5F5F5] text-[18px] text-text-secondary">
              ›
            </span>
          </div>

          <div
            className="absolute grid text-center text-[12px] font-medium"
            style={{
              left: GRID_LEFT,
              top: WEEKDAY_TOP,
              width: GRID_WIDTH,
              gridTemplateColumns: `repeat(7, ${CELL_WIDTH}px)`,
            }}
          >
            {weekdays.map((weekday, index) => (
              <div
                key={weekday}
                className={[
                  index === 0 ? 'text-[#FC4C46]' : '',
                  index === 6 ? 'text-[#4C64FC]' : '',
                  index !== 0 && index !== 6 ? 'text-text-secondary' : '',
                ].join(' ')}
              >
                {weekday}
              </div>
            ))}
          </div>

          <div
            className="absolute grid text-center text-[12px] font-semibold leading-none text-text-strong"
            style={{
              left: GRID_LEFT,
              top: GRID_TOP,
              width: GRID_WIDTH,
              gridTemplateColumns: `repeat(7, ${CELL_WIDTH}px)`,
              gridTemplateRows: `repeat(5, ${CELL_HEIGHT}px)`,
            }}
          >
            {weeks.flatMap((week, rowIndex) =>
              week.map((day, colIndex) => {
                const isSunday = colIndex === 0;
                const isSaturday = colIndex === 6;
                const isOtherMonth =
                  (rowIndex === 0 && colIndex === 0) ||
                  (rowIndex === 4 && colIndex >= 3);
                const isSelectedDay = rowIndex === 0 && day === 4;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}-${day}`}
                    className={[
                      'relative h-[102px]',
                      isSunday ? 'text-[#FC4C46]' : '',
                      isSaturday ? 'text-[#4C64FC]' : '',
                      isOtherMonth ? 'opacity-40' : '',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex size-[24px] items-center justify-center',
                        isSelectedDay
                          ? 'rounded-full bg-[#171717] text-white opacity-100'
                          : '',
                      ].join(' ')}
                    >
                      {day}
                    </span>
                  </div>
                );
              }),
            )}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: GRID_LEFT,
              top: GRID_TOP,
              width: GRID_WIDTH,
              height: CELL_HEIGHT * 5,
            }}
          >
            {schedules.map((schedule) => (
              <div
                key={schedule.title}
                className="absolute truncate rounded-[3px] px-[6px] text-left text-[10px] font-medium leading-[18px] text-[#404040]"
                style={{
                  left: schedule.startCol * CELL_WIDTH + BAR_SIDE_PADDING,
                  top:
                    schedule.row * CELL_HEIGHT +
                    BAR_TOP_OFFSET +
                    schedule.lane * BAR_LANE_GAP,
                  width: schedule.span * CELL_WIDTH - BAR_SIDE_PADDING * 2,
                  height: BAR_HEIGHT,
                  backgroundColor: schedule.color,
                }}
              >
                {schedule.title}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}