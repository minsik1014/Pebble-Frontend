import { Button } from '@/components/ui/Button';

import { SettingsRow } from './SettingsRow';

interface PasswordChangeItemProps {
  isSocialAccount?: boolean;
  onOpen: () => void;
}

export function PasswordChangeItem({
  isSocialAccount = false,
  onOpen,
}: PasswordChangeItemProps) {
  return (
    <SettingsRow
      title="비밀번호"
      description={
        isSocialAccount
          ? '소셜 로그인 계정은 비밀번호를 변경할 수 없어요'
          : '현재 비밀번호를 확인한 뒤 새 비밀번호를 설정해요'
      }
      actions={
        <Button
          aria-label="비밀번호 변경"
          disabled={isSocialAccount}
          onClick={onOpen}
        >
          변경
        </Button>
      }
    />
  );
}