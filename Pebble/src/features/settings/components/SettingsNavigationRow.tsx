import type { ButtonHTMLAttributes } from 'react';

import { ChevronIconArea } from './ChevronIconArea';

interface SettingsNavigationRowProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
}

export function SettingsNavigationRow({
  title,
  description,
  className = '',
  type = 'button',
  ...props
}: SettingsNavigationRowProps) {
  return (
    <button
      type={type}
      className={[
        'flex min-h-[45px] w-full items-center justify-between',
        'gap-token-l text-left',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-border-primary',
        className,
      ].join(' ')}
      {...props}
    >
      <span className="min-w-0">
        <span className="block text-body-02-sb tracking-[-0.01em] text-text-strong">
          {title}
        </span>
        <span className="mt-token-xs block text-caption-01 text-text-secondary">
          {description}
        </span>
      </span>

      <ChevronIconArea />
    </button>
  );
}