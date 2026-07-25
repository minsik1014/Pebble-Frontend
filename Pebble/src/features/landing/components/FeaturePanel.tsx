import type { ReactNode } from 'react';

interface FeaturePanelProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function FeaturePanel({
  title,
  description,
  children,
  className = '',
}: FeaturePanelProps) {
  return (
    <article
      className={[
        'relative h-[624px] w-[1240px] overflow-hidden rounded-token-l bg-fill-surface',
        className,
      ].join(' ')}
    >
      <div className="absolute left-[100px] top-[263px] flex w-[626px] flex-col gap-[20px]">
        <h3 className="text-[40px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
          {title}
        </h3>

        <p className="text-[20px] font-medium leading-[130%] tracking-[-0.01em] text-text-secondary">
          {description}
        </p>
      </div>

      {children}
    </article>
  );
}