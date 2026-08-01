import ReportIcon from "@/assets/icons/memo-outline.svg?react";
import CalendarIcon from "@/assets/icons/calendar-nav-default.svg?react";

import type {
  Alarm,
  CategoryInviteAction,
  FollowRequestAction,
} from "../types/alarm";

interface AlarmItemProps {
  alarm: Alarm;
  onDelete: (alarmId: number) => void;
  onFollowRequestResponse?: (
    alarm: Alarm,
    action: FollowRequestAction,
  ) => Promise<void>;
  onCategoryInviteResponse?: (
    alarm: Alarm,
    action: CategoryInviteAction,
  ) => Promise<void>;
}

const getAlarmIcon = (type: Alarm["type"]) => {
  switch (type) {
    case "TASK_DUE":
    case "MILESTONE_DUE":
      return <CalendarIcon className="size-5" />;
    case "REPORT":
      return <ReportIcon className="size-5" />;
    default:
      return null;
  }
};

const getFollowMessageSuffix = (alarm: Alarm) => {
  if (alarm.type === "FOLLOW_REQUEST") {
    if (alarm.followStatus === "ACCEPTED") {
      return "님의 팔로우 요청을 수락했어요";
    }

    if (alarm.followStatus === "REJECTED") {
      return "님의 팔로우 요청을 거절했어요";
    }

    return "님이 팔로우를 요청했어요";
  }

  if (alarm.type === "FOLLOW_ACCEPTED") {
    return "님이 팔로우를 수락했어요";
  }

  return "";
};

export const AlarmItem = ({
  alarm,
  onDelete,
  onFollowRequestResponse,
  onCategoryInviteResponse,
}: AlarmItemProps) => {
  const isPendingFollowRequest =
    alarm.type === "FOLLOW_REQUEST" &&
    (alarm.followStatus ?? "PENDING") === "PENDING";
  const isPendingCategoryInvite =
    alarm.type === "CATEGORY_INVITE" &&
    (alarm.followStatus ?? "PENDING") === "PENDING";

  const shouldShowActiveBackground =
    alarm.type === "FOLLOW_REQUEST"
      ? isPendingFollowRequest
      : alarm.type === "CATEGORY_INVITE"
        ? isPendingCategoryInvite
        : !alarm.isRead;

  const hasUserImage =
    alarm.type === "FOLLOW_REQUEST" || alarm.type === "FOLLOW_ACCEPTED";

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(alarm.id);
  };

  const handleAccept = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isPendingCategoryInvite) {
      void onCategoryInviteResponse?.(alarm, "ACCEPT");
      return;
    }

    void onFollowRequestResponse?.(alarm, "ACCEPT");
  };

  const handleReject = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isPendingCategoryInvite) {
      void onCategoryInviteResponse?.(alarm, "REJECT");
      return;
    }

    void onFollowRequestResponse?.(alarm, "REJECT");
  };

  return (
    <div
      className={`mt-3 rounded-token-m px-4 py-3.5 transition-colors duration-150 ${
        shouldShowActiveBackground
          ? "bg-[rgba(48,89,255,0.05)] hover:bg-[rgba(23,23,23,0.05)]"
          : "hover:bg-[rgba(23,23,23,0.05)]"
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
            <div className="flex size-full items-center justify-center text-[14px] font-medium text-text-strong">
              {hasUserImage
                ? alarm.user?.nickname.slice(0, 1)
                : getAlarmIcon(alarm.type)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {hasUserImage && alarm.user ? (
            <p className="text-[16px] leading-[22px] text-text-strong">
              <span className="font-semibold">{alarm.user.nickname}</span>
              <span className="font-normal">
                {getFollowMessageSuffix(alarm)}
              </span>
            </p>
          ) : (
            <p className="text-[16px] font-normal leading-[22px] text-text-strong">
              {alarm.content}
            </p>
          )}

          <p className="mt-0.5 text-[13px] font-normal leading-[18px] text-gray-400">
            {alarm.createdAt}
          </p>

          {(isPendingFollowRequest || isPendingCategoryInvite) && (
            <div className="mt-2 flex gap-2.5">
              <button
                type="button"
                onClick={handleAccept}
                className="h-[29px] min-w-[49px] rounded-[6px] bg-[rgba(23,23,23,1)] px-3 text-[14px] font-medium leading-[20px] text-white"
              >
                수락
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="h-[29px] min-w-[49px] rounded-[6px] bg-[rgba(23,23,23,0.05)] px-3 text-[14px] font-medium leading-[20px] text-text-strong"
              >
                거절
              </button>
            </div>
          )}
        </div>

        {!isPendingFollowRequest && !isPendingCategoryInvite && (
          <button
            type="button"
            onClick={handleDelete}
            className="shrink-0 text-[22px] leading-none text-gray-400 hover:text-text-strong"
            aria-label="알림 삭제"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
