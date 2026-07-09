import { createPortal } from "react-dom";

interface AlarmPopoverProps {
  top: number;
  left: number;
}

export const AlarmPopover = ({ top, left }: AlarmPopoverProps) => {
  return createPortal(
    <div
      data-alarm-popover
      className="z-[9999] flex h-[600px] w-[400px] flex-col rounded-[24px] bg-white px-3 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] animate-[popover-in_450ms_ease-in-out]"
      style={{
        position: "fixed",
        top,
        left,
      }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-line-normal px-4 py-3">
        <h2 className="text-body-m font-semibold text-text-strong">알림</h2>

        <button
          type="button"
          className="text-caption-m text-text-secondary hover:text-text-strong"
        >
          전체 삭제
        </button>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto overscroll-contain pr-1">
        {/* 안 읽은 알림 */}
        <div className="rounded-token-m bg-[#3059FF0D] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-semibold text-text-strong">
                오늘의 태스크 알림
              </p>
              <p className="mt-1 text-body-s text-text-secondary">
                오늘 완료해야 할 태스크가 있어요.
              </p>
              <p className="mt-1 text-caption-m text-text-tertiary">
                2026.07.09
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 text-text-tertiary hover:text-text-strong"
              aria-label="알림 삭제"
            >
              ×
            </button>
          </div>
        </div>

        {/* 안 읽은 팔로우 요청 알림 */}
        <div className="mt-1 rounded-token-m bg-[#3059FF0D] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-semibold text-text-strong">
                팔로우 요청
              </p>
              <p className="mt-1 text-body-s text-text-secondary">
                하은님이 팔로우를 요청했어요.
              </p>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="rounded-token-s bg-fill-primary px-3 py-1 text-caption-m text-text-onFill"
                >
                  수락
                </button>
                <button
                  type="button"
                  className="rounded-token-s border border-line-normal px-3 py-1 text-caption-m text-text-secondary"
                >
                  거절
                </button>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 text-text-tertiary hover:text-text-strong"
              aria-label="알림 삭제"
            >
              ×
            </button>
          </div>
        </div>

        {/* 읽은 알림 */}
        <div className="mt-1 rounded-token-m px-4 py-3 hover:bg-fill-surface">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-semibold text-text-strong">
                오늘의 태스크 알림
              </p>
              <p className="mt-1 text-body-s text-text-secondary">
                오늘 완료해야 할 태스크가 있어요.
              </p>
              <p className="mt-1 text-caption-m text-text-tertiary">
                2026.07.09
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 text-text-tertiary hover:text-text-strong"
              aria-label="알림 삭제"
            >
              ×
            </button>
          </div>
        </div>

        {/* 읽은 알림 */}
        <div className="mt-1 rounded-token-m px-4 py-3 hover:bg-fill-surface">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-semibold text-text-strong">
                오늘의 태스크 알림
              </p>
              <p className="mt-1 text-body-s text-text-secondary">
                오늘 완료해야 할 태스크가 있어요.
              </p>
              <p className="mt-1 text-caption-m text-text-tertiary">
                2026.07.09
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 text-text-tertiary hover:text-text-strong"
              aria-label="알림 삭제"
            >
              ×
            </button>
          </div>
        </div>

        {/* 읽은 알림 */}
        <div className="mt-1 rounded-token-m px-4 py-3 hover:bg-fill-surface">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-semibold text-text-strong">
                6월 월말 리포트가 도착했어요!
              </p>
              <p className="mt-1 text-body-s text-text-secondary">
                이번 달 리포트를 확인해보세요.
              </p>
              <p className="mt-1 text-caption-m text-text-tertiary">
                5일 전
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 text-text-tertiary hover:text-text-strong"
              aria-label="알림 삭제"
            >
              ×
            </button>
          </div>
        </div>

        {/* 읽은 알림 */}
        <div className="mt-1 rounded-token-m px-4 py-3 hover:bg-fill-surface">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-semibold text-text-strong">
                오늘 2개의 일정이 있어요
              </p>
              <p className="mt-1 text-body-s text-text-secondary">
                오늘의 일정을 확인해보세요.
              </p>
              <p className="mt-1 text-caption-m text-text-tertiary">
                7일 전
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 text-text-tertiary hover:text-text-strong"
              aria-label="알림 삭제"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};