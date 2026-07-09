import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClassNames: Record<ButtonVariant, string> = {
  secondary: 'bg-btn-quaternary text-text-secondary hover:bg-btn-pressed',
  danger: 'bg-fill-danger text-text-onFill hover:brightness-95',
};

export function Button({
  children,
  variant = 'secondary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex h-12 shrink-0 items-center justify-center',
        'rounded-token-s px-token-l py-token-m',
        'text-body-02-m tracking-[-0.01em]',
        'transition-colors focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClassNames[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}