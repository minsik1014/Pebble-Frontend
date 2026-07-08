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
        'px-token-xxl py-token-xxl',
        'shadow-shadow-m',
        'xl:px-[clamp(40px,16.6667vw,240px)]',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="mx-auto w-full max-w-[808px]">{children}</div>
    </section>
  );
}