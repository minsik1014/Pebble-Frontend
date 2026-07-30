import { Button } from '@/components/ui/Button';
import { useCalendarLayoutContext } from '@/features/calendar/context/useCalendarLayoutContext';

import {
  getBridgePaletteByActivityColor,
  getBridgePaletteById,
} from '../constants/bridgeColorPalettes';
import { useSettings } from '../hooks/useSettings';
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

  return (
    <SettingsContent isSidebarOpen={isSidebarOpen}>
      <DisplaySettingsSection
        theme={settings.theme}
        selectedBridgePaletteId={selectedPalette.id}
        activities={activities}
        isUpdating={updatingField !== null}
        onThemeChange={changeTheme}
        onBridgePaletteChange={async (paletteId) => {
          const palette = getBridgePaletteById(paletteId);
          await changeActivityColor(palette.activityColor);
        }}
      />

      <NotificationSettingsSection
        enabled={settings.notifyTaskDue}
        isUpdating={updatingField !== null}
        onChange={changeNotification}
      />

      <AccountSettingsSection
        currentEmail={currentUser.email}
        isSocialAccount={settings.isSocialOnly}
        isTempPassword={settings.isTempPassword}
      />

      <WithdrawalSection />
    </SettingsContent>
  );
}