import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  deleteAlarm,
  getAlarms,
  readAlarm,
  type NotificationResponse,
} from "@/features/alarm/api/alarmApi";
import {
  acceptFollowRequest,
  deleteFollow,
  getAllFollows,
  type FollowListItem,
} from "@/features/friends/api/followApi";
import { respondCategoryInvite } from "@/features/category/api/sharedCategoryApi";
import { notifyCalendarUpdated } from "@/features/calendar/utils/calendarSync";
import type {
  Alarm,
  CategoryInviteAction,
  AlarmType,
  FollowRequestAction,
} from "@/features/alarm/types/alarm";
import {
  notifyFollowUpdated,
} from "@/features/friends/utils/followSync";

const getAlarmContent = (type: AlarmType) => {
  switch (type) {
    case "TASK_DUE":
      return "마감 예정인 태스크가 있어요";
    case "MILESTONE_DUE":
      return "마감 예정인 마일스톤이 있어요";
    case "REPORT":
      return "월말 리포트가 도착했어요!";
    case "CATEGORY_INVITE":
      return "공유 카테고리 초대가 도착했어요";
    case "CATEGORY_DELETED":
      return "공유 카테고리가 삭제되었어요";
    case "CATEGORY_ACCEPTED":
      return "공유 카테고리 초대가 수락되었어요";
    case "FOLLOW_REQUEST":
      return "팔로우 요청이 도착했어요";
    case "FOLLOW_ACCEPTED":
      return "팔로우 요청이 수락되었어요";
  }
};

const formatRelativeTime = (createdAt: string) => {
  const elapsedMs = Date.now() - new Date(createdAt).getTime();

  if (!Number.isFinite(elapsedMs) || elapsedMs < 60_000) {
    return "방금";
  }

  const minutes = Math.floor(elapsedMs / 60_000);

  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}시간 전`;
  }

  return `${Math.floor(hours / 24)}일 전`;
};

const findFollow = (
  notification: NotificationResponse,
  pendingRequests: FollowListItem[],
  friends: FollowListItem[],
) => {
  if (notification.relatedId === null) {
    return undefined;
  }

  if (notification.type === "FOLLOW_REQUEST") {
    return (
      pendingRequests.find(
        ({ followId }) => followId === notification.relatedId,
      ) ??
      friends.find(({ followId }) => followId === notification.relatedId)
    );
  }

  if (notification.type === "FOLLOW_ACCEPTED") {
    return friends.find(
      ({ followId }) => followId === notification.relatedId,
    );
  }

  return undefined;
};

const mapNotificationToAlarm = (
  notification: NotificationResponse,
  pendingRequests: FollowListItem[],
  friends: FollowListItem[],
): Alarm => {
  const follow = findFollow(notification, pendingRequests, friends);

  return {
    id: notification.id,
    notificationIds: [notification.id],
    unreadNotificationIds: notification.isRead ? [] : [notification.id],
    type: notification.type,
    relatedId: notification.relatedId,
    expiresAt: notification.expiresAt,
    content: getAlarmContent(notification.type),
    isRead: notification.isRead,
    createdAt: formatRelativeTime(notification.createdAt),
    createdAtIso: notification.createdAt,
    friendRequestId:
      notification.type === "FOLLOW_REQUEST"
        ? notification.relatedId ?? undefined
        : undefined,
    followStatus:
      notification.type === "FOLLOW_REQUEST"
        ? follow && pendingRequests.includes(follow)
          ? "PENDING"
          : "ACCEPTED"
        : notification.type === "CATEGORY_INVITE" && !notification.isRead
          ? "PENDING"
          : undefined,
    user: follow
      ? {
          id: follow.userId,
          nickname: follow.nickname,
          profileImageUrl: follow.profileImageUrl,
        }
      : undefined,
  };
};

const isScheduleDueAlarm = (alarm: Alarm) =>
  alarm.type === "TASK_DUE" || alarm.type === "MILESTONE_DUE";

const getKstDateKey = (createdAt: string) => {
  const date = new Date(createdAt);

  if (!Number.isFinite(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const groupScheduleDueAlarms = (alarms: Alarm[]) => {
  const scheduleGroups = new Map<string, Alarm>();
  const result: Alarm[] = [];

  alarms.forEach((alarm) => {
    if (!isScheduleDueAlarm(alarm)) {
      result.push(alarm);
      return;
    }

    const dateKey = getKstDateKey(alarm.createdAtIso);
    const existingGroup = scheduleGroups.get(dateKey);

    if (!existingGroup) {
      const scheduleAlarm = {
        ...alarm,
        content: "오늘 1개의 일정이 있어요",
      };

      scheduleGroups.set(dateKey, scheduleAlarm);
      result.push(scheduleAlarm);
      return;
    }

    existingGroup.notificationIds.push(...alarm.notificationIds);
    existingGroup.unreadNotificationIds.push(
      ...alarm.unreadNotificationIds,
    );
    existingGroup.isRead = existingGroup.unreadNotificationIds.length === 0;
    existingGroup.content = `오늘 ${existingGroup.notificationIds.length}개의 일정이 있어요`;
  });

  return result;
};

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const followStateSignatureRef = useRef<string | null>(null);

  const refreshAlarms = useCallback(async () => {
    const [notificationResponse, pendingResponse, friendsResponse] =
      await Promise.all([
        getAlarms(),
        getAllFollows("pending"),
        getAllFollows("friends"),
      ]);
    const nextFollowStateSignature = JSON.stringify({
      pending: pendingResponse.map(({ followId }) => followId).sort(),
      friends: friendsResponse.map(({ followId }) => followId).sort(),
    });

    if (
      followStateSignatureRef.current !== null &&
      followStateSignatureRef.current !== nextFollowStateSignature
    ) {
      notifyFollowUpdated();
    }

    followStateSignatureRef.current = nextFollowStateSignature;

    setAlarms(
      groupScheduleDueAlarms(notificationResponse.notifications.map((notification) =>
        mapNotificationToAlarm(
          notification,
          pendingResponse,
          friendsResponse,
        ),
      )),
    );
    setUnreadCount(notificationResponse.unreadCount);
  }, []);

  useEffect(() => {
    void refreshAlarms().catch(() => undefined);
  }, [refreshAlarms]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void refreshAlarms().catch(() => undefined);
      }
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshAlarms]);

  const resolvedAlarms = useMemo(() => alarms, [alarms]);

  const handleReadVisibleUnreadAlarms = useCallback(async () => {
    const alarmsToRead = alarms.filter((alarm) => {
      const isPendingFollowRequest =
        alarm.type === "FOLLOW_REQUEST" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";
      const isPendingCategoryInvite =
        alarm.type === "CATEGORY_INVITE" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";

      return (
        !alarm.isRead &&
        !isPendingFollowRequest &&
        !isPendingCategoryInvite
      );
    });

    if (!alarmsToRead.length) {
      return;
    }

    const notificationIdsToRead = alarmsToRead.flatMap(
      ({ unreadNotificationIds }) => unreadNotificationIds,
    );

    await Promise.all(notificationIdsToRead.map(readAlarm));

    const readIds = new Set(alarmsToRead.map(({ id }) => id));
    setAlarms((previous) =>
      previous.map((alarm) =>
        readIds.has(alarm.id)
          ? { ...alarm, isRead: true, unreadNotificationIds: [] }
          : alarm,
      ),
    );
    setUnreadCount((previous) =>
      Math.max(0, previous - notificationIdsToRead.length),
    );
  }, [alarms]);

  const handleDeleteAlarm = async (alarmId: number) => {
    const alarm = alarms.find(({ id }) => id === alarmId);
    const isPendingFollowRequest =
      alarm?.type === "FOLLOW_REQUEST" &&
      (alarm.followStatus ?? "PENDING") === "PENDING";
    const isPendingCategoryInvite =
      alarm?.type === "CATEGORY_INVITE" &&
      (alarm.followStatus ?? "PENDING") === "PENDING";

    if (!alarm || isPendingFollowRequest || isPendingCategoryInvite) {
      return;
    }

    await Promise.all(alarm.notificationIds.map(deleteAlarm));
    setAlarms((previous) =>
      previous.filter(({ id }) => id !== alarmId),
    );

    if (!alarm.isRead) {
      setUnreadCount((previous) =>
        Math.max(0, previous - alarm.unreadNotificationIds.length),
      );
    }
  };

  const handleDeleteAllAlarms = async () => {
    const alarmsToDelete = alarms.filter((alarm) => {
      const isPendingFollowRequest =
        alarm.type === "FOLLOW_REQUEST" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";
      const isPendingCategoryInvite =
        alarm.type === "CATEGORY_INVITE" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";

      return (
        !isPendingFollowRequest &&
        !isPendingCategoryInvite
      );
    });

    if (!alarmsToDelete.length) {
      return;
    }

    await Promise.all(
      alarmsToDelete.flatMap((alarm) =>
        alarm.notificationIds.map(deleteAlarm),
      ),
    );

    const deletedIds = new Set(alarmsToDelete.map(({ id }) => id));
    setAlarms((previous) =>
      previous.filter(({ id }) => !deletedIds.has(id)),
    );
    const deletedUnreadCount = alarmsToDelete.reduce(
      (count, alarm) => count + alarm.unreadNotificationIds.length,
      0,
    );
    setUnreadCount((previous) =>
      Math.max(0, previous - deletedUnreadCount),
    );
  };

  const handleRespondFollowRequest = async (
    alarmId: number,
    action: FollowRequestAction,
  ) => {
    const alarm = alarms.find(({ id }) => id === alarmId);
    const followId = alarm?.friendRequestId;

    if (!alarm || !followId) {
      return;
    }

    if (action === "ACCEPT") {
      await acceptFollowRequest(followId);
    } else {
      await deleteFollow(followId);
    }

    notifyFollowUpdated();

    if (!alarm.isRead) {
      await readAlarm(alarmId);
      setUnreadCount((previous) => Math.max(0, previous - 1));
    }

    setAlarms((previous) =>
      previous.map((item) =>
        item.id === alarmId
          ? {
              ...item,
              isRead: true,
              unreadNotificationIds: [],
              followStatus:
                action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
              content:
                action === "ACCEPT"
                  ? `${item.user?.nickname ?? "상대"}님의 팔로우 요청을 수락했어요`
                  : `${item.user?.nickname ?? "상대"}님의 팔로우 요청을 거절했어요`,
            }
          : item,
      ),
    );
  };

  const handleRespondCategoryInvite = async (
    alarmId: number,
    action: CategoryInviteAction,
  ) => {
    const alarm = alarms.find(({ id }) => id === alarmId);
    const categoryId = alarm?.relatedId;

    if (!alarm || !categoryId) {
      return;
    }

    await respondCategoryInvite(String(categoryId), action);

    if (action === "ACCEPT") {
      notifyCalendarUpdated();
    }

    if (!alarm.isRead) {
      await readAlarm(alarmId);
      setUnreadCount((previous) => Math.max(0, previous - 1));
    }

    setAlarms((previous) =>
      previous.map((item) =>
        item.id === alarmId
          ? {
              ...item,
              isRead: true,
              unreadNotificationIds: [],
              followStatus:
                action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
              content:
                action === "ACCEPT"
                  ? "공유 카테고리 초대를 수락했어요"
                  : "공유 카테고리 초대를 거절했어요",
            }
          : item,
      ),
    );
  };

  return {
    alarms: resolvedAlarms,
    unreadCount,
    refreshAlarms,
    handleReadVisibleUnreadAlarms,
    handleDeleteAlarm,
    handleDeleteAllAlarms,
    handleRespondFollowRequest,
    handleRespondCategoryInvite,
  };
};
