import CautionIcon from '@/assets/icons/Caution.svg?react';
import UserIcon from '@/assets/icons/user-outline.svg?react';

import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

import { DisplaySettingsSection } from './DisplaySettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { SettingsContent } from './SettingsContent';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { SettingsRow } from './SettingsRow';

const MOCK_EMAIL = 'example1234@naver.com';

export function SettingsView() {
  return (
    <SettingsContent>
      <DisplaySettingsSection />

      <NotificationSettingsSection />

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
                  title={MOCK_EMAIL}
                >
                  {MOCK_EMAIL}
                </span>
                <Button aria-label="이메일 변경">변경</Button>
              </>
            }
          />

          <Divider />

          <SettingsRow
            title="비밀번호"
            description="현재 비밀번호를 확인한 뒤 새 비밀번호를 설정해요"
            actions={<Button aria-label="비밀번호 변경">변경</Button>}
          />
        </div>
      </SettingsSection>

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