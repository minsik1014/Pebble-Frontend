import { useState } from 'react';

import CautionIcon from '@/assets/icons/Caution.svg?react';

import { Button } from '@/components/ui/Button';

import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';

export function WithdrawalSection() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <SettingsSection className="min-h-[179px]">
      <SettingsSectionHeader icon={CautionIcon} title="회원 탈퇴" />

      <div className="mt-token-l flex flex-col gap-token-l">
        <SettingsRow
          title="회원 탈퇴"
          description="모든 데이터가 삭제되며, 복구할 수 없어요"
          actions={
            <Button
              variant="danger"
              aria-label="회원 탈퇴 확인 모달 열기"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              탈퇴하기
            </Button>
          }
        />
      </div>

      {/* TODO: WithdrawalConfirmModal 연결 */}
      {isConfirmModalOpen ? null : null}
    </SettingsSection>
  );
}