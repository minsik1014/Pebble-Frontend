import { SettingsContent } from './SettingsContent';
import { SettingsSection } from './SettingsSection';

export function SettingsView() {
  return (
    <SettingsContent>
      <SettingsSection>화면 섹션</SettingsSection>
      <SettingsSection>알림 섹션</SettingsSection>
      <SettingsSection>계정 관리 섹션</SettingsSection>
      <SettingsSection>회원 탈퇴 섹션</SettingsSection>
    </SettingsContent>
  );
}