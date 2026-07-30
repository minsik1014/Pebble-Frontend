import { useState } from 'react';

import DesktopIcon from '@/assets/icons/Desktop.svg?react';

import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

import type { SettingsTheme } from '../types/settings';
import type { DailyBridgeActivity } from '../utils/bridgeActivity';
import { BridgeColorModal } from './BridgeColorModal';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { ThemeSegmentControl, type ThemeMode } from './ThemeSegmentControl';

interface DisplaySettingsSectionProps {
  theme: SettingsTheme;
  selectedBridgePaletteId: string;
  activities: DailyBridgeActivity[];
  isUpdating: boolean;
  onThemeChange: (theme: SettingsTheme) => Promise<void>;
  onBridgePaletteChange: (paletteId: string) => Promise<void>;
}

export function DisplaySettingsSection({
  theme,
  selectedBridgePaletteId,
  activities,
  isUpdating,
  onThemeChange,
  onBridgePaletteChange,
}: DisplaySettingsSectionProps) {
  const [isBridgeColorModalOpen, setIsBridgeColorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const themeMode: ThemeMode = theme === 'DARK' ? 'dark' : 'light';

  const handleThemeChange = async (nextTheme: ThemeMode) => {
    setErrorMessage('');

    try {
      await onThemeChange(nextTheme === 'dark' ? 'DARK' : 'LIGHT');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '테마 설정을 변경하지 못했어요.',
      );
    }
  };

  return (
    <>
      <SettingsSection className="min-h-[284px]">
        <SettingsSectionHeader icon={DesktopIcon} title="화면" />

        <div className="mt-token-l flex flex-col gap-token-l">
          <SettingsRow
            title="앱 테마"
            description="라이트 또는 다크 모드를 선택해요"
            actions={
              <ThemeSegmentControl
                value={themeMode}
                disabled={isUpdating}
                onChange={(value) => void handleThemeChange(value)}
              />
            }
          />

          <Divider />

          <SettingsRow
            title="징검다리 색상"
            description="언제든 다시 바꿀 수 있어요"
            actions={
              <Button
                type="button"
                variant="secondary"
                disabled={isUpdating}
                aria-label="징검다리 색상 변경"
                onClick={() => setIsBridgeColorModalOpen(true)}
              >
                변경
              </Button>
            }
          />

          {errorMessage ? (
            <p className="text-caption-01 text-fill-danger">{errorMessage}</p>
          ) : null}
        </div>
      </SettingsSection>

      <BridgeColorModal
        open={isBridgeColorModalOpen}
        selectedPaletteId={selectedBridgePaletteId}
        activities={activities}
        onOpenChange={setIsBridgeColorModalOpen}
        onConfirm={onBridgePaletteChange}
      />
    </>
  );
}