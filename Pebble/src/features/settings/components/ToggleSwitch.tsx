import type { ButtonHTMLAttributes } from 'react';

interface ToggleSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ToggleSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}: ToggleSwitchProps) {
  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onCheckedChange(!checked);
      }}
      className={[
        'relative h-[30px] w-[52px] shrink-0 rounded-token-infinite',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        checked ? 'bg-fill-primary' : 'bg-text-quaternary',
        className,
      ].join(' ')}
      {...props}
    >
      <span
        aria-hidden="true"
        className={[
          'absolute top-0.5 size-[26px] rounded-full bg-fill-inverse',
          'transition-transform',
          checked ? 'translate-x-[24px]' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  );
}