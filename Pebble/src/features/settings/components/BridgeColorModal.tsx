import { useEffect, useId, useMemo, useState } from 'react';

import CloseIcon from '@/assets/icons/Close.svg?react';

import { Button } from '@/components/ui/Button';

import {
  BRIDGE_COLOR_PALETTES,
  getBridgePaletteById,
  getBridgePaletteColors,
} from '../constants/bridgeColorPalettes';
import {
  getRecentSevenDayBridgeColors,
  type DailyBridgeActivity,
} from '../utils/bridgeActivity';

interface BridgeColorModalProps {
  open: boolean;
  selectedPaletteId: string;
  activities: DailyBridgeActivity[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (paletteId: string) => Promise<void>;
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
  activities,
  onOpenChange,
  onConfirm,
}: BridgeColorModalProps) {
  const titleId = useId();

  const [draftPaletteId, setDraftPaletteId] = useState(selectedPaletteId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      setDraftPaletteId(selectedPaletteId);
      setIsSubmitting(false);
      setErrorMessage('');
    }
  }, [open, selectedPaletteId]);

  const draftPalette = useMemo(
    () => getBridgePaletteById(draftPaletteId),
    [draftPaletteId],
  );

  const previewColors = useMemo(
    () =>
      getRecentSevenDayBridgeColors({
        activities,
        palette: draftPalette,
      }),
    [activities, draftPalette],
  );

  const hasChanged = draftPaletteId !== selectedPaletteId;

  const handleClose = () => {
    if (isSubmitting) return;

    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!hasChanged || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onConfirm(draftPaletteId);
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '징검다리 색상을 변경하지 못했어요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/45"
      role="presentation"
      onMouseDown={handleClose}
    >
      <section
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
            disabled={isSubmitting}
            aria-label="징검다리 색상 모달 닫기"
            className="flex size-11 items-start justify-end text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary disabled:cursor-not-allowed disabled:opacity-50"
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
                key={`${draftPaletteId}-${color}-${index}`}
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
                disabled={isSubmitting}
                aria-pressed={isSelected}
                aria-label={`${palette.name} ${palette.tone} 색상 선택`}
                className={[
                  'flex h-[108px] w-[184px] flex-col gap-token-m rounded-token-s bg-fill-surface p-token-l text-left',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary',
                  'disabled:cursor-not-allowed',
                  isSelected
                    ? 'border-2 border-border-primary'
                    : 'border-2 border-transparent',
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

        {errorMessage ? (
          <p className="text-caption-01 text-fill-danger">{errorMessage}</p>
        ) : null}

        <div className="mt-auto flex h-11 w-full gap-token-m">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            className="h-11 w-[282px] !bg-btn-quaternary !text-text-strong"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            type="button"
            disabled={!hasChanged || isSubmitting}
            className={[
              'h-11 w-[282px] disabled:opacity-100',
              hasChanged && !isSubmitting
                ? '!bg-btn-primary !text-text-onFill'
                : '!bg-btn-teritary !text-text-teritary',
            ].join(' ')}
            onClick={() => void handleConfirm()}
          >
            {isSubmitting ? '변경 중...' : '변경'}
          </Button>
        </div>
      </section>
    </div>
  );
}