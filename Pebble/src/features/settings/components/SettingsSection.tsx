import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface SettingsSectionProps extends ComponentPropsWithoutRef<'section'> {
  children: ReactNode;
}

export function SettingsSection({
  children,
  className = '',
  ...props
}: SettingsSectionProps) {
  return (
    <section
      className={[
        'w-full rounded-token-m bg-fill-inverse',
        'px-[240px] py-token-xxl',
        'shadow-shadow-m',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="mx-auto w-full max-w-[808px]">{children}</div>
    </section>
  );
}