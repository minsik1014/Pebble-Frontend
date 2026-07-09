import { useState } from 'react';

import UserIcon from '@/assets/icons/user-outline.svg?react';

import { Divider } from '@/components/ui/Divider';

import { EmailChangeItem } from './EmailChangeItem';
import { PasswordChangeItem } from './PasswordChangeItem';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';

interface AccountSettingsSectionProps {
  currentEmail: string;
  isSocialAccount?: boolean;
}

export function AccountSettingsSection({
  currentEmail,
  isSocialAccount = false,
}: AccountSettingsSectionProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <SettingsSection className="min-h-[268px]">
      <SettingsSectionHeader icon={UserIcon} title="계정 관리" />

      <div className="mt-token-l flex flex-col gap-token-l">
        <EmailChangeItem
          currentEmail={currentEmail}
          onOpen={() => setIsEmailModalOpen(true)}
        />

        <Divider />

        <PasswordChangeItem
          isSocialAccount={isSocialAccount}
          onOpen={() => setIsPasswordModalOpen(true)}
        />
      </div>

      {/* TODO: EmailChangeModal 연결 */}
      {/* TODO: PasswordChangeModal 연결 */}
    </SettingsSection>
  );
}