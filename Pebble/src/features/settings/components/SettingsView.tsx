import BellIcon from '@/assets/icons/bell-outline.svg?react';
import CautionIcon from '@/assets/icons/Caution.svg?react';
import DesktopIcon from '@/assets/icons/Desktop.svg?react';
import MoonIcon from '@/assets/icons/Moon.svg?react';
import SunIcon from '@/assets/icons/Sun.svg?react';
import UserIcon from '@/assets/icons/user-outline.svg?react';

import { Divider } from '@/components/ui/Divider';

import { SettingsContent } from './SettingsContent';
import { SettingsNavigationRow } from './SettingsNavigationRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { SettingsRow } from './SettingsRow';

function ThemeSegmentPreview() {
  return (
    <span
      aria-label="앱 테마: 라이트 선택됨"
      className="flex h-12 w-[194px] items-center gap-token-xs rounded-token-s bg-btn-quaternary p-token-xs"
    >
      <span className="flex h-10 flex-1 items-center justify-center gap-token-s rounded-[10px] bg-fill-inverse text-body-02-m text-text-strong shadow-shadow-s">
        <SunIcon className="size-5" aria-hidden="true" />
        라이트
      </span>
      <span className="flex h-10 flex-1 items-center justify-center gap-token-s rounded-[10px] text-body-02-m text-text-teritary">
        <MoonIcon className="size-5" aria-hidden="true" />
        다크
      </span>
    </span>
  );
}

function TogglePreview() {
  return (
    <span
      aria-label="당일 일정 알림 꺼짐"
      className="relative h-[30px] w-[52px] rounded-token-infinite bg-text-quaternary"
    >
      <span className="absolute left-0.5 top-0.5 size-[26px] rounded-full bg-fill-inverse" />
    </span>
  );
}

export function SettingsView() {
  return (
    <SettingsContent>
      <SettingsSection className="xl:min-h-[351px]">
        <SettingsSectionHeader icon={DesktopIcon} title="화면" />

        <div className="mt-token-l flex flex-col gap-token-l">
          <SettingsRow
            title="앱 테마"
            description="라이트 또는 다크 모드를 선택해요"
            actions={<ThemeSegmentPreview />}
          />

          <Divider />

          <SettingsNavigationRow
            title="테마 색상"
            description="언제든 다시 바꿀 수 있어요"
            aria-label="테마 색상 설정 열기"
          />

          <Divider />

          <SettingsNavigationRow
            title="징검다리 색상"
            description="언제든 다시 바꿀 수 있어요"
            aria-label="징검다리 색상 설정 열기"
          />
        </div>
      </SettingsSection>

      <SettingsSection className="xl:min-h-[176px]">
        <SettingsSectionHeader icon={BellIcon} title="알림" />

        <div className="mt-token-l flex flex-col gap-token-l">
            <SettingsRow
                title="당일 일정 알림"
                description="오늘 예정된 일정을 아침에 알려드려요"
                actions={<TogglePreview />}
            />
        </div>
      </SettingsSection>

      <SettingsSection>
        <SettingsSectionHeader icon={UserIcon} title="계정 관리" />
      </SettingsSection>

      <SettingsSection>
        <SettingsSectionHeader icon={CautionIcon} title="회원 탈퇴" />
      </SettingsSection>
    </SettingsContent>
  );
}