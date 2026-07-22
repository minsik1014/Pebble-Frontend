const eventTasks = [
  {
    title: '참가자 모집',
    width: 356,
    height: 48,
    left: 784,
    top: 273,
    bg: '#FFEFAD',
    bar: false,
  },
  {
    title: '참가 신청 오픈',
    width: 310,
    height: 44,
    left: 824,
    top: 345,
    bg: '#FFF6D5',
    bar: true,
  },
  {
    title: '참석 인원 확인',
    width: 310,
    height: 44,
    left: 810,
    top: 409,
    bg: '#FFF6D5',
    bar: true,
  },
];

export function TaskColorPreview() {
  return (
    <>
      <div className="absolute left-[764px] top-[185px] flex h-[68px] w-[374px] items-center gap-[10.63px] rounded-[21.25px] bg-fill-inverse py-[12.75px] pl-[21.25px] pr-[12.75px] shadow-shadow-m">
        <span className="h-[43px] w-[8px] rounded-token-s bg-[#FFD540]" />
        <strong className="text-[28px] font-bold leading-[120%] tracking-[-0.01em] text-text-strong">
          행사준비
        </strong>
      </div>

      {eventTasks.map((task) => (
        <div
          key={task.title}
          className="absolute flex items-center rounded-token-xs px-token-m py-token-xs shadow-[0_0_23.17px_rgba(23,23,23,0.05)]"
          style={{
            left: task.left,
            top: task.top,
            width: task.width,
            height: task.height,
            backgroundColor: task.bg,
          }}
        >
          {task.bar ? (
            <span className="mr-[12px] h-[28px] w-[5px] rounded-full bg-[#FFD540]" />
          ) : null}

          <span className="text-[20px] font-medium leading-[130%] tracking-[-0.01em] text-text-strong">
            {task.title}
          </span>
        </div>
      ))}
    </>
  );
}