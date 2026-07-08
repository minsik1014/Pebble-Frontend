import BellIcon from '@/assets/icons/bell-outline.svg?react';
import CautionIcon from '@/assets/icons/Caution.svg?react';
import DesktopIcon from '@/assets/icons/Desktop.svg?react';
import UserIcon from '@/assets/icons/user-outline.svg?react';

import { SettingsContent } from './SettingsContent';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';

export function SettingsView() {
  return (
    <SettingsContent>
      <SettingsSection>
        <SettingsSectionHeader icon={DesktopIcon} title="화면" />
      </SettingsSection>

      <SettingsSection>
        <SettingsSectionHeader icon={BellIcon} title="알림" />
      </SettingsSection>

      <SettingsSection>
        <SettingsSectionHeader icon={UserIcon} title="계정 관리" />
      </SettingsSection>

      <SettingsSection>
        <SettingsSectionHeader icon={CautionIcon} title="회원 탈퇴" />
      </SettingsSection>
    </SettingsContent>
  );
}