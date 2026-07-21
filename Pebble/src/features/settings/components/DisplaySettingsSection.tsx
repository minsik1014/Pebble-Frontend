import { useState } from 'react';

import DesktopIcon from '@/assets/icons/Desktop.svg?react';

import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

import { DEFAULT_BRIDGE_PALETTE_ID } from '../constants/bridgeColorPalettes';
import { BridgeColorModal } from './BridgeColorModal';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { ThemeSegmentControl, type ThemeMode } from './ThemeSegmentControl';

export function DisplaySettingsSection() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedBridgePaletteId, setSelectedBridgePaletteId] = useState(
    DEFAULT_BRIDGE_PALETTE_ID,
  );
  const [isBridgeColorModalOpen, setIsBridgeColorModalOpen] = useState(false);

  const handleChangeBridgePalette = (paletteId: string) => {
    // TODO: API 확정 후 징검다리 색상 변경 mutation으로 교체
    setSelectedBridgePaletteId(paletteId);
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
              <ThemeSegmentControl value={themeMode} onChange={setThemeMode} />
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
                aria-label="징검다리 색상 변경"
                onClick={() => setIsBridgeColorModalOpen(true)}
              >
                변경
              </Button>
            }
          />
        </div>
      </SettingsSection>

      <BridgeColorModal
        open={isBridgeColorModalOpen}
        selectedPaletteId={selectedBridgePaletteId}
        onOpenChange={setIsBridgeColorModalOpen}
        onConfirm={handleChangeBridgePalette}
      />
    </>
  );
}