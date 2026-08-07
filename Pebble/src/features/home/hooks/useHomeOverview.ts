import { useEffect, useState } from "react";

import {
  getAllFollows,
  type FollowListItem,
} from "@/features/friends/api/followApi";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";
import {
  getMySettings,
  getUserActivityLogs,
} from "@/features/settings/api/settingsApi";
import type { ActivityLogItem } from "@/features/settings/types/settings";

type HomeActivity = {
  color: string;
  logs: ActivityLogItem[];
};

const DEFAULT_ACTIVITY: HomeActivity = {
  color: "#A3A3A3",
  logs: [],
};

export const useHomeOverview = () => {
  const profile = useProfileStore((state) => state.profile);
  const isProfileLoaded = useProfileStore((state) => state.isLoaded);
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const [friends, setFriends] = useState<FollowListItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [activity, setActivity] = useState<HomeActivity>(DEFAULT_ACTIVITY);

  useEffect(() => {
    if (!isProfileLoaded) {
      void loadProfile();
    }
  }, [isProfileLoaded, loadProfile]);

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getAllFollows("friends"),
      getAllFollows("pending"),
    ])
      .then(([friendList, pendingList]) => {
        if (!isActive) return;

        setFriends(friendList);
        setPendingCount(pendingList.length);
      })
      .catch(() => {
        if (!isActive) return;

        setFriends([]);
        setPendingCount(0);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!profile.id) return;

    let isActive = true;

    void Promise.allSettled([
      getUserActivityLogs({ userId: profile.id }),
      getMySettings(),
    ]).then(([activityResult, settingsResult]) => {
      if (!isActive) return;

      setActivity({
        color:
          settingsResult.status === "fulfilled"
            ? settingsResult.value.activityColor
            : activityResult.status === "fulfilled"
              ? activityResult.value.activityColor
              : DEFAULT_ACTIVITY.color,
        logs:
          activityResult.status === "fulfilled"
            ? activityResult.value.logs
            : DEFAULT_ACTIVITY.logs,
      });
    });

    return () => {
      isActive = false;
    };
  }, [profile.id]);

  return {
    profile,
    friends,
    pendingCount,
    activity,
  };
};
