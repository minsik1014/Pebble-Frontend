import { useState } from 'react';

import BellIcon from '@/assets/icons/bell-outline.svg?react';

import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { ToggleSwitch } from './ToggleSwitch';

const DEFAULT_NOTIFICATION_ENABLED = true;

/**
 * API 연동 전 Mock 서버 값입니다.
 * undefined이면 신규 계정으로 보고 기본값 true를 사용합니다.
 * boolean 값이 들어오면 서버 상태를 우선합니다.
 */
const mockServerNotificationEnabled: boolean | undefined = undefined;

export function NotificationSettingsSection() {
  const initialNotificationEnabled =
    mockServerNotificationEnabled ?? DEFAULT_NOTIFICATION_ENABLED;

  const [notificationEnabled, setNotificationEnabled] = useState(
    initialNotificationEnabled,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNotificationChange = async (nextChecked: boolean) => {
    if (isUpdating) return;

    const previousChecked = notificationEnabled;

    // 낙관적 업데이트
    setNotificationEnabled(nextChecked);
    setIsUpdating(true);

    try {
      // TODO: 알림 설정 변경 API 연동
      await Promise.resolve();
    } catch {
      // 실패 시 롤백
      setNotificationEnabled(previousChecked);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SettingsSection className="min-h-[176px]">
      <SettingsSectionHeader icon={BellIcon} title="알림" />

      <div className="mt-token-l flex flex-col gap-token-l">
        <SettingsRow
          title="당일 일정 알림"
          description="오늘 예정된 일정을 아침에 알려드려요"
          actions={
            <ToggleSwitch
              checked={notificationEnabled}
              disabled={isUpdating}
              aria-label="당일 일정 알림"
              onCheckedChange={handleNotificationChange}
            />
          }
        />
      </div>
    </SettingsSection>
  );
}