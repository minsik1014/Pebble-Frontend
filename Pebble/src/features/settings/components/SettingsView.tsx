import { useCalendarLayoutContext } from '@/features/calendar/context/useCalendarLayoutContext';
import { AccountSettingsSection } from './AccountSettingsSection';
import { DisplaySettingsSection } from './DisplaySettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { SettingsContent } from './SettingsContent';
import { WithdrawalSection } from './WithdrawalSection';

const MOCK_EMAIL = 'example1234@naver.com';
const MOCK_IS_SOCIAL_ACCOUNT = false;

export function SettingsView() {
  const { isSidebarOpen } = useCalendarLayoutContext();

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
