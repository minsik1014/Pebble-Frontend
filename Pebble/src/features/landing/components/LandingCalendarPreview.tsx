const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const days = [
  31, 1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 1, 2, 3, 4,
];

const categories = [
  { title: '사이드 프로젝트', color: '#8B84F2' },
  { title: '행사 준비', color: '#FFD540' },
  { title: '자격증 시험', color: '#22D3EE' },
];

const schedules = [
  {
    row: 1,
    col: 1,
    span: 3,
    title: '1차 MVP 완성',
    color: '#B9B5F7',
  },
  {
    row: 1,
    col: 4,
    span: 1,
    title: '계획서 작성',
    color: '#B9B5F7',
  },
  {
    row: 2,
    col: 0,
    span: 3,
    title: '참여자 모집',
    color: '#FFEFAD',
  },
  {
    row: 2,
    col: 3,
    span: 2,
    title: '장소 예약',
    color: '#FFF6D5',
  },
];

export function LandingCalendarPreview() {
  return (
    <div className="absolute left-[200px] top-[734px] h-[640px] w-[1040px] overflow-hidden rounded-token-l bg-fill-inverse shadow-shadow-m">
      <div className="absolute left-[70px] top-[64px] flex h-[640px] w-[900px] bg-fill-inverse">
        <aside className="h-[625px] w-[298px] rounded-[12.5px] bg-fill-inverse shadow-[0_0_17.5px_rgba(23,23,23,0.05)]">
          <div className="flex h-full">
            <div className="flex w-[60px] flex-col items-center justify-between border-r border-border-tertiary py-8">
              <div className="size-4 rounded bg-[#171717]" />
              <div className="flex flex-col items-center gap-10">
                <div className="size-4 rounded-full border border-[#171717]" />
                <div className="size-8 rounded-token-s bg-[#171717]" />
                <div className="size-4 rounded-full border border-[#171717]" />
              </div>
              <div className="size-4 rounded-full border border-[#171717]" />
            </div>

            <div className="flex-1 px-5 py-7">
              <div className="mb-7 flex items-center justify-between">
                <h3 className="text-[24px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
                  6월
                </h3>
                <div className="h-10 w-[84px] rounded-token-s bg-btn-quaternary" />
              </div>

              <div className="flex flex-col gap-4">
                {categories.map((category) => (
                  <div
                    key={category.title}
                    className="flex h-[48px] items-center justify-between rounded-token-s bg-fill-inverse px-4 shadow-shadow-m"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-8 w-1.5 rounded-token-s"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-[16px] font-semibold text-text-strong">
                        {category.title}
                      </span>
                    </div>
                    <span className="text-text-teritary">⌄</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                tabIndex={-1}
                className="mt-5 h-[44px] w-full rounded-token-s bg-btn-primary text-[14px] font-medium text-text-onFill"
              >
                추가하기
              </button>
            </div>
          </div>
        </aside>

        <section className="ml-[17.5px] h-[625px] w-[578px] rounded-[12.5px] bg-fill-inverse px-8 py-8 shadow-[0_0_17.5px_rgba(23,23,23,0.05)]">
          <div className="mb-8 flex items-center gap-3">
            <h3 className="text-[24px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
              2026년 6월
            </h3>
            <span className="flex size-8 items-center justify-center rounded-full bg-btn-quaternary">
              ‹
            </span>
            <span className="rounded-full bg-btn-quaternary px-3 py-2 text-[12px] text-text-secondary">
              오늘
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-btn-quaternary">
              ›
            </span>
          </div>

          <div className="grid grid-cols-7 text-center text-[12px] font-medium">
            {weekdays.map((weekday, index) => (
              <div
                key={weekday}
                className={[
                  'h-8',
                  index === 0 ? 'text-[#FC4C46]' : '',
                  index === 6 ? 'text-[#4C64FC]' : '',
                  index !== 0 && index !== 6 ? 'text-text-secondary' : '',
                ].join(' ')}
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-7 grid-rows-5 text-center text-[12px] font-semibold text-text-strong">
            {days.map((day, index) => {
              const col = index % 7;
              const isSunday = col === 0;
              const isSaturday = col === 6;
              const isOtherMonth = index === 0 || index >= 31;

              return (
                <div
                  key={`${day}-${index}`}
                  className={[
                    'h-[86px] pt-2',
                    isSunday ? 'text-[#FC4C46]' : '',
                    isSaturday ? 'text-[#4C64FC]' : '',
                    isOtherMonth ? 'opacity-40' : '',
                  ].join(' ')}
                >
                  <span
                    className={
                      day === 4 && index === 4
                        ? 'inline-flex size-6 items-center justify-center rounded-full bg-[#171717] text-white'
                        : ''
                    }
                  >
                    {day}
                  </span>
                </div>
              );
            })}

            {schedules.map((schedule) => (
              <div
                key={schedule.title}
                style={{
                  gridColumn: `${schedule.col + 1} / span ${schedule.span}`,
                  gridRow: schedule.row + 2,
                  backgroundColor: schedule.color,
                }}
                className="z-10 mx-1 mt-10 h-[18px] rounded-[3px] px-2 text-left text-[10px] font-medium leading-[18px] text-[#404040]"
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