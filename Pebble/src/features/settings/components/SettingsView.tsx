import type { MainLayoutContext } from '@/components/layout/MainLayout';
import { AccountSettingsSection } from './AccountSettingsSection';
import { DisplaySettingsSection } from './DisplaySettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { SettingsContent } from './SettingsContent';
import { WithdrawalSection } from './WithdrawalSection';
import { useOutletContext } from 'react-router-dom';

const MOCK_EMAIL = 'example1234@naver.com';
const MOCK_IS_SOCIAL_ACCOUNT = false;

export function SettingsView() {
  const { isSidebarOpen } = useOutletContext<MainLayoutContext>();

  return (
    <SettingsContent isSidebarOpen={isSidebarOpen}>
      <DisplaySettingsSection />

      <NotificationSettingsSection />

      <AccountSettingsSection
        currentEmail={MOCK_EMAIL}
        isSocialAccount={MOCK_IS_SOCIAL_ACCOUNT}
      />

      <WithdrawalSection />
    </SettingsContent>
  );
}
