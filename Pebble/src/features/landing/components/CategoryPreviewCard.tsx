import CheckIcon from '@/assets/icons/Check.svg?react';
import ChevronUpIcon from '@/assets/icons/chevron-up.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';

const previewTasks = [
  {
    title: '1차 MVP 완성',
    period: '6/8~6/11',
    done: false,
    disabled: false,
  },
  {
    title: '핵심 화면 정리',
    period: '6/8~6/9',
    done: true,
    disabled: true,
  },
  {
    title: '캘린더 연결',
    period: '6/10',
    done: false,
    disabled: false,
  },
  {
    title: '계획서 작성',
    period: '6/12',
    done: false,
    disabled: false,
  },
];

export function CategoryPreviewCard() {
  return (
    <div className="absolute left-[780px] top-[130px] h-[364px] w-[360px] rounded-[20.45px] bg-fill-inverse px-[20px] py-[18px] shadow-[0_0_22.91px_rgba(23,23,23,0.05)]">
      <div className="mb-[22px] flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <span className="h-[40px] w-[8px] rounded-token-s bg-[#8B84F2]" />
          <strong className="text-[28px] font-bold leading-[120%] tracking-[-0.01em] text-text-strong">
            사이드 프로젝트
          </strong>
        </div>

        <div className="flex items-center gap-[22px] text-text-secondary">
          <ChevronUpIcon className="size-6" aria-hidden="true" />
          <EyeOnIcon className="size-6" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-[20px]">
        {previewTasks.map((task) => (
          <div
            key={task.title}
            className={[
              'flex h-[38px] items-center justify-between',
              task.disabled ? 'opacity-35' : '',
            ].join(' ')}
          >
            <div className="flex items-center gap-[12px]">
              <span className="h-[34px] w-[7px] rounded-full bg-[#B9B5F7]" />
              <span className="text-[16px] font-medium leading-[150%] tracking-[-0.01em] text-text-primary">
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-[14px]">
              <span className="text-[16px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
                {task.period}
              </span>

              <span
                className={[
                  'flex size-[24px] items-center justify-center rounded-[4px] border',
                  task.done
                    ? 'border-[#171717] bg-[#171717] text-white'
                    : 'border-[#D4D4D4] bg-fill-inverse',
                ].join(' ')}
              >
                {task.done ? (
                  <CheckIcon className="size-4" aria-hidden="true" />
                ) : null}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        tabIndex={-1}
        className="mt-[20px] h-[50px] w-full rounded-[10px] bg-btn-quaternary text-[16px] font-medium leading-[150%] tracking-[-0.01em] text-text-secondary"
      >
        일정 추가하기
      </button>
    </div>
  );
}