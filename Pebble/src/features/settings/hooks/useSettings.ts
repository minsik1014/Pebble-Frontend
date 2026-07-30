import { useCallback, useEffect, useState } from 'react';

import {
  getCurrentUser,
  getMySettings,
  getUserActivityLogs,
  updateMySettings,
} from '../api/settingsApi';
import type {
  CurrentUser,
  SettingsTheme,
  UserSettings,
} from '../types/settings';
import type { DailyBridgeActivity } from '../utils/bridgeActivity';

function applyTheme(theme: SettingsTheme) {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = theme.toLowerCase();
  document.documentElement.classList.toggle('dark', theme === 'DARK');
}

export function useSettings() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activities, setActivities] = useState<DailyBridgeActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingField, setUpdatingField] = useState<
    'theme' | 'notification' | 'activityColor' | null
  >(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const [user, loadedSettings] = await Promise.all([
        getCurrentUser(),
        getMySettings(),
      ]);

      setCurrentUser(user);
      setSettings(loadedSettings);
      applyTheme(loadedSettings.theme);

      try {
        const activityData = await getUserActivityLogs({
          userId: user.id,
        });

        setActivities(
          activityData.logs.map((log) => ({
            date: log.date,
            completedTaskCount: log.completedTaskCount,
          })),
        );
      } catch {
        // 미리보기 조회 실패가 설정 페이지 전체를 막지 않도록 처리합니다.
        setActivities([]);
      }
    } catch (error) {
      setCurrentUser(null);
      setSettings(null);
      setActivities([]);

      setLoadError(
        error instanceof Error
          ? error.message
          : '설정 정보를 불러오지 못했어요.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const changeTheme = async (nextTheme: SettingsTheme) => {
    if (!settings || updatingField) return;
    if (settings.theme === nextTheme) return;

    const previousSettings = settings;

    setUpdatingField('theme');
    setSettings({
      ...settings,
      theme: nextTheme,
    });
    applyTheme(nextTheme);

    try {
      const result = await updateMySettings({
        theme: nextTheme,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              ...result,
            }
          : current,
      );
      applyTheme(result.theme);
    } catch (error) {
      setSettings(previousSettings);
      applyTheme(previousSettings.theme);
      throw error;
    } finally {
      setUpdatingField(null);
    }
  };

  const changeNotification = async (notifyTaskDue: boolean) => {
    if (!settings || updatingField) return;

    const previousSettings = settings;

    setUpdatingField('notification');
    setSettings({
      ...settings,
      notifyTaskDue,
    });

    try {
      const result = await updateMySettings({
        notifyTaskDue,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              ...result,
            }
          : current,
      );
    } catch (error) {
      setSettings(previousSettings);
      throw error;
    } finally {
      setUpdatingField(null);
    }
  };

  const changeActivityColor = async (activityColor: string) => {
    if (!settings || updatingField) return;
    if (
      settings.activityColor.toUpperCase() === activityColor.toUpperCase()
    ) {
      return;
    }

    const previousSettings = settings;

    setUpdatingField('activityColor');
    setSettings({
      ...settings,
      activityColor,
    });

    try {
      const result = await updateMySettings({
        activityColor,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              ...result,
            }
          : current,
      );
    } catch (error) {
      setSettings(previousSettings);
      throw error;
    } finally {
      setUpdatingField(null);
    }
  };

  return {
    currentUser,
    settings,
    activities,

    isLoading,
    loadError,
    updatingField,

    reload: loadSettings,
    changeTheme,
    changeNotification,
    changeActivityColor,
  };
}