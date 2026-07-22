import { AccountSettingsSection } from './AccountSettingsSection';
import { DisplaySettingsSection } from './DisplaySettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { SettingsContent } from './SettingsContent';
import { WithdrawalSection } from './WithdrawalSection';

const MOCK_EMAIL = 'example1234@naver.com';
const MOCK_IS_SOCIAL_ACCOUNT = false;

export function SettingsView() {
  return (
    <SettingsContent>
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
