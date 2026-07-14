import { useState } from 'react';

import UserIcon from '@/assets/icons/user-outline.svg?react';

import { Divider } from '@/components/ui/Divider';

import { EmailChangeItem } from './EmailChangeItem';
import { EmailChangeModal } from './EmailChangeModal';
import { PasswordChangeItem } from './PasswordChangeItem';
import { PasswordChangeModal } from './PasswordChangeModal';
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

  const handleOpenPasswordModal = () => {
    if (isSocialAccount) return;

    setIsPasswordModalOpen(true);
  };

  return (
    <>
      <SettingsSection className="min-h-[268px]">
        <SettingsSectionHeader icon={UserIcon} title="계정 관리" />

        <div className="mt-token-l flex flex-col gap-token-l">
          <EmailChangeItem
            currentEmail={currentEmail}
            onOpen={() => setIsEmailModalOpen(true)}
          />

          <Divider />

          <PasswordChangeItem
            disabled={isSocialAccount}
            onClick={handleOpenPasswordModal}
          />
        </div>
      </SettingsSection>

      <EmailChangeModal
        open={isEmailModalOpen}
        currentEmail={currentEmail}
        onOpenChange={setIsEmailModalOpen}
      />

      <PasswordChangeModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </>
  );
}