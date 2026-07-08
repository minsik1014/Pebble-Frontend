import type { HTMLAttributes } from 'react';

type DividerProps = HTMLAttributes<HTMLHRElement>;

export function Divider({ className = '', ...props }: DividerProps) {
  return (
    <hr
      aria-hidden="true"
      className={[
        'h-px w-full shrink-0 rounded-token-infinite',
        'border-0 bg-btn-quaternary',
        className,
      ].join(' ')}
      {...props}
    />
  );
}