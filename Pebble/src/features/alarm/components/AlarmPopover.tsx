import { createPortal } from "react-dom";

import { mockAlarms } from "../mock/alarmMock";
import { AlarmItem } from "./AlarmItem";

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
        {mockAlarms.map((alarm) => (
          <AlarmItem key={alarm.id} alarm={alarm} />
        ))}
      </div>
    </div>,
    document.body
  );
};