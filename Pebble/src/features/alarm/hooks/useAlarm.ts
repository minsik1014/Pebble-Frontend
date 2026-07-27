import { useCallback, useEffect, useMemo, useState } from "react";

import {
  deleteAlarm,
  deleteAllAlarms,
  getAlarms,
  readAlarm,
  respondFollowRequest,
} from "../api/alarmApi";
import { useFriendStore } from "@/features/friends/store/useFriendStore";
import type { Alarm, FollowRequestAction } from "../types/alarm";

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const friendRequests = useFriendStore((state) => state.requests);
  const respondFriendRequest = useFriendStore(
    (state) => state.respondRequest,
  );

  useEffect(() => {
    const fetchAlarms = async () => {
      const data = await getAlarms();
      setAlarms(data);
    };

    fetchAlarms();
  }, []);

  const resolvedAlarms = useMemo(
    () =>
      alarms.map((alarm) => {
        if (alarm.type !== "FOLLOW_REQUEST" || !alarm.friendRequestId) {
          return alarm;
        }

        const request = friendRequests.find(
          ({ id }) => id === alarm.friendRequestId,
        );

        if (!request) {
          return alarm;
        }

        return {
          ...alarm,
          followStatus: request.status,
          isRead: request.status === "PENDING" ? alarm.isRead : true,
        };
      }),
    [alarms, friendRequests],
  );

  const unreadCount = useMemo(() => {
    return resolvedAlarms.filter((alarm) => !alarm.isRead).length;
  }, [resolvedAlarms]);


  const handleReadVisibleUnreadAlarms = useCallback(async () => {
    const alarmsToRead = resolvedAlarms.filter((alarm) => {
      const isPendingFollowRequest =
        alarm.type === "FOLLOW_REQUEST" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";

      return !alarm.isRead && !isPendingFollowRequest;
    });

    await Promise.all(alarmsToRead.map((alarm) => readAlarm(alarm.id)));

    setAlarms((prev) =>
      prev.map((alarm) => {
        const isPendingFollowRequest =
          alarm.type === "FOLLOW_REQUEST" &&
          (alarm.followStatus ?? "PENDING") === "PENDING";

        if (alarm.isRead || isPendingFollowRequest) {
          return alarm;
        }

        return {
          ...alarm,
          isRead: true,
        };
      }),
    );
  }, [resolvedAlarms]);

  const handleDeleteAlarm = async (alarmId: number) => {
    const alarmToDelete = resolvedAlarms.find((alarm) => alarm.id === alarmId);
    const isPendingFollowRequest =
      alarmToDelete?.type === "FOLLOW_REQUEST" &&
      (alarmToDelete.followStatus ?? "PENDING") === "PENDING";

    if (isPendingFollowRequest) {
      return;
    }

    await deleteAlarm(alarmId);

    setAlarms((prev) => prev.filter((alarm) => alarm.id !== alarmId));
  };

  const handleDeleteAllAlarms = async () => {
    await deleteAllAlarms();

    const pendingAlarmIds = new Set(
      resolvedAlarms
        .filter(
          (alarm) =>
            alarm.type === "FOLLOW_REQUEST" &&
            (alarm.followStatus ?? "PENDING") === "PENDING",
        )
        .map(({ id }) => id),
    );

    setAlarms((prev) => prev.filter(({ id }) => pendingAlarmIds.has(id)));
  };

  const handleRespondFollowRequest = async (
    alarmId: number,
    action: FollowRequestAction,
  ) => {
    const alarm = alarms.find(({ id }) => id === alarmId);

    if (alarm?.friendRequestId) {
      respondFriendRequest(alarm.friendRequestId, action);
    }

    await respondFollowRequest(alarmId, action);

    setAlarms((prev) =>
      prev.map((alarm) => {
        if (alarm.id !== alarmId) {
          return alarm;
        }

        const nickname = alarm.user?.nickname ?? "상대";

        return {
          ...alarm,
          isRead: true,
          followStatus: action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
          content:
            action === "ACCEPT"
              ? `${nickname}님의 팔로우 요청을 수락했어요`
              : `${nickname}님의 팔로우 요청을 거절했어요`,
        };
      }),
    );
  };

  return {
    alarms: resolvedAlarms,
    unreadCount,
    handleReadVisibleUnreadAlarms,
    handleDeleteAlarm,
    handleDeleteAllAlarms,
    handleRespondFollowRequest,
  };
};
