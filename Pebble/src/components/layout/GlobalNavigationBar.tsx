import { useCallback, useEffect, useRef, useState } from "react";

import BellOutlineIcon from "@/assets/icons/bell-outline no-dot.svg?react";
import SocialOutlineIcon from "@/assets/icons/social-outline.svg?react";
import CalendarSolidIcon from "@/assets/icons/calendar-nav-selected.svg?react";
import MyOutlineIcon from "@/assets/icons/user-outline.svg?react";
import SettingsOutlineIcon from "@/assets/icons/settings-outline.svg?react";
import LogOutIcon from "@/assets/icons/logout.svg?react";

import { AlarmPopover } from "@/features/alarm/components/AlarmPopover";
import { useAlarms } from "@/features/alarm/hooks/useAlarm";

export const GlobalNavigationBar = () => {
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  });

  const alarmButtonRef = useRef<HTMLButtonElement>(null);

  const {
    alarms,
    unreadCount,
    handleReadVisibleUnreadAlarms,
    handleDeleteAlarm,
    handleDeleteAllAlarms,
    handleRespondFollowRequest,
  } = useAlarms();

  const openAlarmPopover = () => {
    const rect = alarmButtonRef.current?.getBoundingClientRect();

    if (rect) {
      setPopoverPosition({
        top: rect.top,
        left: rect.right + 24,
      });
    }

    setIsAlarmOpen(true);
  };

  const closeAlarmPopover = useCallback(async () => {
    await handleReadVisibleUnreadAlarms();
    setIsAlarmOpen(false);
  }, [handleReadVisibleUnreadAlarms]);

  const toggleAlarmPopover = async () => {
    if (isAlarmOpen) {
      await closeAlarmPopover();
      return;
    }

    openAlarmPopover();
  };

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideButton = alarmButtonRef.current?.contains(target);
      const isInsidePopover =
        target instanceof Element && target.closest("[data-alarm-popover]");

      if (!isInsideButton && !isInsidePopover) {
        await closeAlarmPopover();
      }
    };

    if (isAlarmOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAlarmOpen, closeAlarmPopover]);

  return (
    <nav className="relative z-50 h-[1000px] w-[84px] shrink-0 px-5 py-8 bg-fill-inverse inline-flex flex-col justify-start items-center gap-10 overflow-visible">
      <div className="flex-1 flex flex-col justify-between items-center w-full">
        {/* 상단: 알림 그룹 */}
        <div className="flex flex-col justify-start items-center gap-5 w-full">
          <div className="size-11 relative flex items-center justify-center rounded-token-s">
            <button
              ref={alarmButtonRef}
              type="button"
              onClick={toggleAlarmPopover}
              className={`size-11 relative flex items-center justify-center rounded-token-s cursor-pointer transition-colors duration-[450ms] ease-in-out ${
                isAlarmOpen
                  ? "bg-black text-white"
                  : "text-text-secondary hover:bg-fill-surface hover:text-text-strong"
              }`}
              aria-label="알림 목록 열기"
              aria-expanded={isAlarmOpen}
            >
              <BellOutlineIcon className="size-6" />

              {/* 빨간 점: 알림창을 아직 확인하지 않은 알림이 있을 때만 표시 */}
              {unreadCount > 0 && (
                <div className="size-1 absolute right-[10px] top-[10px] bg-fill-danger rounded-full" />
              )}
            </button>

            {isAlarmOpen && (
              <AlarmPopover
                top={popoverPosition.top}
                left={popoverPosition.left}
                alarms={alarms}
                onDelete={handleDeleteAlarm}
                onDeleteAll={handleDeleteAllAlarms}
                onRespondFollowRequest={handleRespondFollowRequest}
              />
            )}
          </div>
        </div>

        {/* 중앙: 메뉴 그룹 */}
        <div className="flex flex-col justify-start items-center gap-10 w-full">
          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <SocialOutlineIcon className="size-6" />
          </div>

          <div className="size-11 relative flex items-center justify-center rounded-token-s bg-fill-primary text-text-onFill cursor-pointer shadow-sm">
            <CalendarSolidIcon className="size-6" />
          </div>

          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <MyOutlineIcon className="size-6" />
          </div>
        </div>

        {/* 하단: 설정 그룹 */}
        <div className="flex flex-col justify-start items-center gap-10 w-full">
          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <SettingsOutlineIcon className="size-6" />
          </div>

          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <LogOutIcon className="size-6" />
          </div>
        </div>
      </div>
    </nav>
  );
};