import { useState } from 'react';

import DesktopIcon from '@/assets/icons/Desktop.svg?react';

import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

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
    <SettingsSection className="min-h-[284px]">
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

        <SettingsRow
          title="징검다리 색상"
          description="언제든 다시 바꿀 수 있어요"
          actions={
            <Button type="button" aria-label="징검다리 색상 변경">
              변경
            </Button>
          }
        />
      </div>
    </SettingsSection>
  );
}