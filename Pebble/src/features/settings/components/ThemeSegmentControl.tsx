import MoonIcon from '@/assets/icons/Moon.svg?react';
import SunIcon from '@/assets/icons/Sun.svg?react';

export type ThemeMode = 'light' | 'dark';

interface ThemeSegmentControlProps {
  value: ThemeMode;
  disabled?: boolean;
  onChange: (value: ThemeMode) => void;
}

const themeOptions = [
  {
    value: 'light',
    label: '라이트',
    icon: SunIcon,
  },
  {
    value: 'dark',
    label: '다크',
    icon: MoonIcon,
  },
] as const;

export function ThemeSegmentControl({
  value,
  disabled = false,
  onChange,
}: ThemeSegmentControlProps) {
  return (
    <div
      role="group"
      aria-label="앱 테마 선택"
      className="flex h-12 w-[194px] items-center gap-token-xs rounded-token-s bg-btn-quaternary p-token-xs"
    >
      {themeOptions.map(({ value: optionValue, label, icon: Icon }) => {
        const isSelected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            onClick={() => onChange(optionValue)}
            className={[
              'flex h-10 flex-1 items-center justify-center gap-token-s rounded-[10px]',
              'text-body-02-m transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary',
              'disabled:cursor-not-allowed disabled:opacity-60',
              isSelected
                ? 'bg-fill-inverse text-text-strong shadow-shadow-s'
                : 'text-text-teritary hover:text-text-primary',
            ].join(' ')}
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}