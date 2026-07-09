import CautionIcon from '@/assets/icons/Caution.svg?react';

import { Button } from '@/components/ui/Button';

import { AccountSettingsSection } from './AccountSettingsSection';
import { DisplaySettingsSection } from './DisplaySettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { SettingsContent } from './SettingsContent';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { SettingsRow } from './SettingsRow';

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

      <SettingsSection className="min-h-[179px]">
        <SettingsSectionHeader icon={CautionIcon} title="회원 탈퇴" />

        <div className="mt-token-l flex flex-col gap-token-l">
          <SettingsRow
            title="회원 탈퇴"
            description="모든 데이터가 삭제되며, 복구할 수 없어요"
            actions={<Button variant="danger">탈퇴하기</Button>}
          />
        </div>
      </SettingsSection>
    </SettingsContent>
  );
}