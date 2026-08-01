
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useCalendarLayoutContext } from '@/features/calendar/context/useCalendarLayoutContext';

import {
  getBridgePaletteByActivityColor,
  getBridgePaletteById,
} from '../constants/bridgeColorPalettes';
import { useSettings } from '../hooks/useSettings';
import type { SettingsTheme } from '../types/settings';
import { AccountSettingsSection } from './AccountSettingsSection';
import { DisplaySettingsSection } from './DisplaySettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { SettingsContent } from './SettingsContent';
import { SettingsErrorToast } from './SettingsErrorToast';
import { WithdrawalSection } from './WithdrawalSection';

type FailedSettingsAction =
  | {
      type: 'theme';
      value: SettingsTheme;
    }
  | {
      type: 'notification';
      value: boolean;
    }
  | {
      type: 'activityColor';
      value: string;
    };

const SETTINGS_API_ERROR_MESSAGE =
  '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

export function SettingsView() {
  const { isSidebarOpen } = useCalendarLayoutContext();

  const {
    currentUser,
    settings,
    activities,

    isLoading,
    loadError,
    updatingField,

    reload,
    changeTheme,
    changeNotification,
    changeActivityColor,
    markPasswordChanged,
  } = useSettings();

  const [failedAction, setFailedAction] =
    useState<FailedSettingsAction | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  if (isLoading) {
    return (
      <SettingsContent isSidebarOpen={isSidebarOpen}>
        <div className="flex min-h-[284px] items-center justify-center rounded-token-m bg-fill-surface shadow-shadow-m">
          <p className="text-body-02-m text-text-secondary">
            설정을 불러오는 중이에요.
          </p>
        </div>
      </SettingsContent>
    );
  }

  if (!currentUser || !settings) {
    return (
      <SettingsContent isSidebarOpen={isSidebarOpen}>
        <div className="flex min-h-[284px] flex-col items-center justify-center gap-token-l rounded-token-m bg-fill-surface shadow-shadow-m">
          <p className="text-body-02-m text-fill-danger">
            {loadError || '설정 정보를 불러오지 못했어요.'}
          </p>

          <Button variant="primary" onClick={() => void reload()}>
            다시 시도
          </Button>
        </div>
      </SettingsContent>
    );
  }

  const selectedPalette = getBridgePaletteByActivityColor(
    settings.activityColor,
  );

  const handleThemeChange = async (nextTheme: SettingsTheme) => {
    setFailedAction(null);

    try {
      await changeTheme(nextTheme);
    } catch {
      setFailedAction({
        type: 'theme',
        value: nextTheme,
      });

      throw new Error(SETTINGS_API_ERROR_MESSAGE);
    }
  };

  const handleNotificationChange = async (nextEnabled: boolean) => {
    setFailedAction(null);

    try {
      await changeNotification(nextEnabled);
    } catch {
      setFailedAction({
        type: 'notification',
        value: nextEnabled,
      });

      throw new Error(SETTINGS_API_ERROR_MESSAGE);
    }
  };

  const handleBridgePaletteChange = async (paletteId: string) => {
    const palette = getBridgePaletteById(paletteId);

    setFailedAction(null);

    try {
      await changeActivityColor(palette.activityColor);
    } catch {
      setFailedAction({
        type: 'activityColor',
        value: palette.activityColor,
      });

      throw new Error(SETTINGS_API_ERROR_MESSAGE);
    }
  };

  const handleRetry = async () => {
    if (!failedAction || isRetrying) return;

    setIsRetrying(true);

    try {
      switch (failedAction.type) {
        case 'theme':
          await changeTheme(failedAction.value);
          break;

        case 'notification':
          await changeNotification(failedAction.value);
          break;

        case 'activityColor':
          await changeActivityColor(failedAction.value);
          break;
      }

      setFailedAction(null);
    } catch {
      // 다시 실패하면 토스트와 실패 액션을 유지합니다.
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <>
      <SettingsContent isSidebarOpen={isSidebarOpen}>
        <DisplaySettingsSection
          theme={settings.theme}
          selectedBridgePaletteId={selectedPalette.id}
          activities={activities}
          isUpdating={updatingField !== null}
          onThemeChange={handleThemeChange}
          onBridgePaletteChange={handleBridgePaletteChange}
        />

        <NotificationSettingsSection
          enabled={settings.notifyTaskDue}
          isUpdating={updatingField !== null}
          onChange={handleNotificationChange}
        />

        <AccountSettingsSection
          currentEmail={currentUser.email}
          isSocialAccount={settings.isSocialOnly}
          isTempPassword={settings.isTempPassword}
          onPasswordChanged={markPasswordChanged}
        />

        <WithdrawalSection />
      </SettingsContent>

      <SettingsErrorToast
        open={failedAction !== null}
        message={SETTINGS_API_ERROR_MESSAGE}
        isRetrying={isRetrying}
        onRetry={() => void handleRetry()}
        onClose={() => {
          if (!isRetrying) {
            setFailedAction(null);
          }
        }}
      />
    </>
  );
}
