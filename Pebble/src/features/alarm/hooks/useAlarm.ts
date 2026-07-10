import { useCallback, useEffect, useMemo, useState } from "react";

import {
  deleteAlarm,
  deleteAllAlarms,
  getAlarms,
  readAlarm,
  respondFollowRequest,
} from "../api/alarmApi";
import type { Alarm, FollowRequestAction } from "../types/alarm";

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    const fetchAlarms = async () => {
      const data = await getAlarms();
      setAlarms(data);
    };

    fetchAlarms();
  }, []);

  const unreadCount = useMemo(() => {
    return alarms.filter((alarm) => !alarm.isRead).length;
  }, [alarms]);


  const handleReadVisibleUnreadAlarms = useCallback(async () => {
    const alarmsToRead = alarms.filter((alarm) => {
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
  }, [alarms]);

  const handleDeleteAlarm = async (alarmId: number) => {
    await deleteAlarm(alarmId);

    setAlarms((prev) => prev.filter((alarm) => alarm.id !== alarmId));
  };

  const handleDeleteAllAlarms = async () => {
    await deleteAllAlarms();

    setAlarms((prev) =>
      prev.filter(
        (alarm) =>
          alarm.type === "FOLLOW_REQUEST" &&
          (alarm.followStatus ?? "PENDING") === "PENDING",
      ),
    );
  };

  const handleRespondFollowRequest = async (
    alarmId: number,
    action: FollowRequestAction,
  ) => {
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
    alarms,
    unreadCount,
    handleReadVisibleUnreadAlarms,
    handleDeleteAlarm,
    handleDeleteAllAlarms,
    handleRespondFollowRequest,
  };
};