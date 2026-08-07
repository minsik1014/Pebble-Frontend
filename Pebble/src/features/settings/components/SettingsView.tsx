import { Button } from '@/components/ui/Button';
import { useCalendarLayoutContext } from '@/features/calendar/context/useCalendarLayoutContext';
import { useRetryableAction } from '@/hooks/useRetryableAction';

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
import { WithdrawalSection } from './WithdrawalSection';

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
  } = useSettings();

  const {
    isRunning: isRetryingAction,
    run,
  } = useRetryableAction();

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

          <Button
            variant="primary"
            onClick={() => void reload()}
          >
            다시 시도
          </Button>
        </div>
      </SettingsContent>
    );
  }

  const selectedPalette =
    getBridgePaletteByActivityColor(
      settings.activityColor,
    );

  const executeRetryableChange = async (
    action: () => Promise<void>,
  ) => {
    const result = await run(action);

    /*
     * 하위 모달과 설정 섹션에서도 실패를 인식해야
     * 입력값과 열린 상태를 유지할 수 있습니다.
     */
    if (result.success === false) {
      throw result.error;
    }
  };

  const handleThemeChange = async (
    nextTheme: SettingsTheme,
  ) => {
    await executeRetryableChange(async () => {
      await changeTheme(nextTheme);
    });
  };

  const handleNotificationChange = async (
    nextEnabled: boolean,
  ) => {
    await executeRetryableChange(async () => {
      await changeNotification(nextEnabled);
    });
  };

  const handleBridgePaletteChange = async (
    paletteId: string,
  ) => {
    const palette =
      getBridgePaletteById(paletteId);

    await executeRetryableChange(async () => {
      await changeActivityColor(
        palette.activityColor,
      );
    });
  };

  const isUpdating =
    updatingField !== null ||
    isRetryingAction;

  return (
    <SettingsContent
      isSidebarOpen={isSidebarOpen}
    >
      <DisplaySettingsSection
        theme={settings.theme}
        selectedBridgePaletteId={
          selectedPalette.id
        }
        activities={activities}
        isUpdating={isUpdating}
        onThemeChange={handleThemeChange}
        onBridgePaletteChange={
          handleBridgePaletteChange
        }
      />

      <NotificationSettingsSection
        enabled={settings.notifyTaskDue}
        isUpdating={isUpdating}
        onChange={handleNotificationChange}
      />

      <AccountSettingsSection
        currentEmail={currentUser.email}
        isSocialAccount={
          settings.isSocialOnly
        }
        isTempPassword={
          settings.isTempPassword
        }
      />

      <WithdrawalSection />
    </SettingsContent>
  );
}