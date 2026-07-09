import type { Alarm } from "../types/alarm";
import ReportIcon from "@/assets/icons/memo-outline.svg?react"
import CalendarIcon from "@/assets/icons/calendar-nav-default.svg?react"
interface AlarmItemProps {
  alarm: Alarm;
}

const getAlarmIcon = (type: Alarm["type"]) => {
  switch (type) {
    case "TASK":
      return <CalendarIcon className="size-5" />;
    case "REPORT":
      return <ReportIcon className="size-5" />;
    default:
      return null;
  }
};

export const AlarmItem = ({ alarm }: AlarmItemProps) => {
  const isFollowRequest = alarm.type === "FOLLOW_REQUEST";
  const hasUserImage =
    alarm.type === "FOLLOW_REQUEST" || alarm.type === "FOLLOW_ACCEPT";

   return (
    <div
      className={`mt-1 rounded-token-m px-4 py-3 ${
        alarm.isRead ? "hover:bg-fill-surface" : "bg-[#3059FF0D]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="size-10 shrink-0 overflow-hidden rounded-full bg-fill-surface">
          {hasUserImage && alarm.user?.profileImageUrl ? (
            <img
              src={alarm.user.profileImageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-text-tertiary">
              {hasUserImage
                ? alarm.user?.nickname.slice(0, 1)
                : getAlarmIcon(alarm.type)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-body-s font-semibold text-text-strong">
            {alarm.content}
          </p>

          <p className="mt-1 text-caption-m text-text-tertiary">
            {alarm.createdAt}
          </p>

          {isFollowRequest && (
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
          )}
        </div>
      </div>
    </div>
  );
};