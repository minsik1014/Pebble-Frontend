const categoryCards = [
  {
    id: 'category-main',
    width: 800,
    left: 320,
    top: 460,
    zIndex: 30,
    title: '카테고리',
    description: '이루고 싶은 목표를 모아 보세요',
    titleClassName: 'text-[28px]',
    descriptionClassName: 'text-[24px]',
  },
  {
    id: 'category-second',
    width: 720,
    left: 360,
    top: 508,
    zIndex: 20,
    title: '카테고리',
    description: '이루고 싶은 목표를 한 곳에',
    titleClassName: 'text-[40px]',
    descriptionClassName: 'text-[32px]',
  },
  {
    id: 'category-third',
    width: 640,
    left: 400,
    top: 556,
    zIndex: 10,
    title: '카테고리',
    description: '이루고 싶은 목표를 한 곳에',
    titleClassName: 'text-[40px]',
    descriptionClassName: 'text-[32px]',
  },
];

export function StepStructureSection() {
  return (
    <div className="relative h-[1024px] w-[1440px] overflow-hidden bg-[linear-gradient(116.82deg,#FFFFFF_0%,#FAFAFA_100%)]">
      <p className="absolute left-[510px] top-[240px] w-[421px] text-center text-[32px] font-medium leading-[130%] tracking-[-0.01em] text-text-secondary">
        목표를 놓치지 않는 가장 쉬운 방법
      </p>

      <h2 className="absolute left-[274px] top-[298px] w-[893px] text-center text-[64px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
        큰 목표부터 오늘 할 일까지, 3단계로
      </h2>

      {categoryCards.map((card) => (
        <div
          key={card.id}
          className="absolute flex h-[200px] items-center rounded-token-l bg-fill-inverse shadow-[0_0_50px_rgba(23,23,23,0.1)]"
          style={{
            left: card.left,
            top: card.top,
            width: card.width,
            zIndex: card.zIndex,
          }}
        >
          <div className="flex w-full items-center">
            <strong
              className={[
                'ml-[137px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong',
                card.titleClassName,
              ].join(' ')}
            >
              {card.title}
            </strong>

            <span
              className={[
                'ml-[140px] font-semibold leading-[130%] tracking-[-0.01em] text-text-secondary',
                card.descriptionClassName,
              ].join(' ')}
            >
              {card.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}