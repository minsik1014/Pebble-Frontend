import UserIcon from '@/assets/icons/user-outline.svg?react';

import { Divider } from '@/components/ui/Divider';

import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { Button } from '@/components/ui/Button';

interface AccountSettingsSectionProps {
  currentEmail: string;
  isSocialAccount?: boolean;
}

export function AccountSettingsSection({
  currentEmail,
  isSocialAccount = false,
}: AccountSettingsSectionProps) {
  return (
    <SettingsSection className="min-h-[268px]">
      <SettingsSectionHeader icon={UserIcon} title="계정 관리" />

      <div className="mt-token-l flex flex-col gap-token-l">
        <SettingsRow
          title="이메일"
          description="새 이메일로 변경하고 인증을 완료해야 적용돼요"
          actions={
            <>
              <span
                className="max-w-[185px] truncate text-body-02-m tracking-[-0.01em] text-text-primary"
                title={currentEmail}
              >
                {currentEmail}
              </span>
              <Button aria-label="이메일 변경">변경</Button>
            </>
          }
        />

        <Divider />

        <SettingsRow
          title="비밀번호"
          description={
            isSocialAccount
              ? '소셜 로그인 계정은 비밀번호를 변경할 수 없어요'
              : '현재 비밀번호를 확인한 뒤 새 비밀번호를 설정해요'
          }
          actions={
            <Button aria-label="비밀번호 변경" disabled={isSocialAccount}>
              변경
            </Button>
          }
        />
      </div>
    </SettingsSection>
  );
}