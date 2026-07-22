import { useEffect, useId, useMemo, useState } from 'react';

import CloseIcon from '@/assets/icons/Close.svg?react';

import { Button } from '@/components/ui/Button';
import { ModalViewportPanel } from '@/components/ui/ModalViewportPanel';

import {
  BRIDGE_COLOR_PALETTES,
  getBridgePaletteById,
  getBridgePaletteColors,
} from '../constants/bridgeColorPalettes';
import {
  getRecentSevenDayBridgeColors,
  MOCK_RECENT_BRIDGE_ACTIVITIES,
} from '../utils/bridgeActivity';

interface BridgeColorModalProps {
  open: boolean;
  selectedPaletteId: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paletteId: string) => void;
}

interface ColorChipProps {
  color: string;
  size?: 'preview' | 'card';
}

function ColorChip({ color, size = 'card' }: ColorChipProps) {
  const isEmptyChip = color.toUpperCase() === '#FAFAFA';

  return (
    <span
      className={[
        'shrink-0 rounded-token-s',
        size === 'preview' ? 'h-12 w-[75.43px]' : 'h-8 w-[33px]',
        isEmptyChip ? 'border border-border-secondary' : '',
      ].join(' ')}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

export function BridgeColorModal({
  open,
  selectedPaletteId,
  onOpenChange,
  onConfirm,
}: BridgeColorModalProps) {
  const titleId = useId();
  const [draftPaletteId, setDraftPaletteId] = useState(selectedPaletteId);

  useEffect(() => {
    if (open) {
      setDraftPaletteId(selectedPaletteId);
    }
  }, [open, selectedPaletteId]);

  const draftPalette = useMemo(
    () => getBridgePaletteById(draftPaletteId),
    [draftPaletteId],
  );

  const previewColors = useMemo(
    () =>
      getRecentSevenDayBridgeColors({
        activities: MOCK_RECENT_BRIDGE_ACTIVITIES,
        palette: draftPalette,
      }),
    [draftPalette],
  );

  const hasChanged = draftPaletteId !== selectedPaletteId;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (!hasChanged) return;

    onConfirm(draftPaletteId);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/45"
      role="presentation"
      onMouseDown={handleClose}
    >
      <ModalViewportPanel
        as="section"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-[547px] w-[640px] flex-col gap-token-l rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex h-11 w-full items-start justify-between">
          <h2
            id={titleId}
            className="text-title-02-sb tracking-[-0.01em] text-text-strong"
          >
            징검다리 색상
          </h2>

          <button
            type="button"
            aria-label="징검다리 색상 모달 닫기"
            className="flex size-11 items-start justify-end text-text-secondary transition-colors hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary"
            onClick={handleClose}
          >
            <CloseIcon className="size-6" aria-hidden="true" />
          </button>
        </header>

        <div className="flex h-[115px] w-full flex-col gap-token-xs">
          <p className="text-[18px] font-medium leading-[150%] tracking-[-0.01em] text-text-primary">
            {draftPalette.name}
          </p>

          <div className="flex h-12 w-full gap-token-xs">
            {previewColors.map((color, index) => (
              <ColorChip
                key={`${draftPaletteId}-preview-${color}-${index}`}
                color={color}
                size="preview"
              />
            ))}
          </div>

          <p className="text-body-02-m tracking-[-0.01em] text-text-teritary">
            최근 7일 미리보기
          </p>
        </div>

        <div className="grid h-[228px] w-full grid-cols-3 grid-rows-2 gap-token-m">
          {BRIDGE_COLOR_PALETTES.map((palette) => {
            const isSelected = palette.id === draftPaletteId;
            const colors = getBridgePaletteColors(palette);

            return (
              <button
                key={palette.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${palette.name} ${palette.tone} 색상 선택`}
                className={[
                  'flex h-[108px] w-[184px] flex-col gap-token-m rounded-token-s bg-fill-surface p-token-l text-left transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary',
                  isSelected
                    ? 'border-2 border-border-primary'
                    : 'border-2 border-transparent hover:border-border-secondary',
                ].join(' ')}
                onClick={() => setDraftPaletteId(palette.id)}
              >
                <span className="flex h-6 items-center gap-token-xs">
                  <span className="text-body-02-m tracking-[-0.01em] text-text-strong">
                    {palette.name}
                  </span>
                  <span className="text-[14px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
                    {palette.tone}
                  </span>
                </span>

                <span className="flex h-8 gap-token-xs">
                  {colors.map((color, index) => (
                    <ColorChip
                      key={`${palette.id}-${color}-${index}`}
                      color={color}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex h-11 w-full gap-token-m">
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-[282px] !bg-btn-quaternary !text-text-strong hover:!bg-btn-pressed"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            type="button"
            disabled={!hasChanged}
            className={[
              'h-11 w-[282px] disabled:opacity-100',
              hasChanged
                ? '!bg-btn-primary !text-text-onFill'
                : '!bg-text-secondary !text-text-teritary',
            ].join(' ')}
            onClick={handleConfirm}
          >
            변경
          </Button>
        </div>
      </ModalViewportPanel>
    </div>
  );
}
