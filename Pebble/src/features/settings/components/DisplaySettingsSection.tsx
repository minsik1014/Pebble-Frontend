import { useState } from 'react';

import DesktopIcon from '@/assets/icons/Desktop.svg?react';

import { Divider } from '@/components/ui/Divider';

import { SettingsNavigationRow } from './SettingsNavigationRow';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import {
  ThemeSegmentControl,
  type ThemeMode,
} from './ThemeSegmentControl';

export function DisplaySettingsSection() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  return (
    <SettingsSection className="min-h-[351px]">
      <SettingsSectionHeader icon={DesktopIcon} title="화면" />

      <div className="mt-token-l flex flex-col gap-token-l">
        <SettingsRow
          title="앱 테마"
          description="라이트 또는 다크 모드를 선택해요"
          actions={
            <ThemeSegmentControl value={themeMode} onChange={setThemeMode} />
          }
        />

        <Divider />

        <SettingsNavigationRow
          title="테마 색상"
          description="언제든 다시 바꿀 수 있어요"
          aria-label="테마 색상 설정 열기"
          onClick={() => {
            // TODO: 테마 색상 설정 화면/모달 연결
          }}
        />

        <Divider />

        <SettingsNavigationRow
          title="징검다리 색상"
          description="언제든 다시 바꿀 수 있어요"
          aria-label="징검다리 색상 설정 열기"
          onClick={() => {
            // TODO: 징검다리 색상 설정 화면/모달 연결
          }}
        />
      </div>
    </SettingsSection>
  );
}