type InfoBadgeProps = {
  description: string;
};

export const InfoBadge = ({ description }: InfoBadgeProps): JSX.Element => (
  <span
    className="group relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-border-default text-caption-01 text-text-quaternary focus:outline-none focus-visible:ring-2 focus-visible:ring-border-primary"
    tabIndex={0}
  >
    !
    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 hidden w-max max-w-[260px] -translate-x-1/2 rounded-token-s bg-fill-primary px-3 py-2 text-left text-caption-01 text-text-onFill shadow-shadow-s group-hover:block group-focus:block">
      {description}
    </span>
  </span>
);
