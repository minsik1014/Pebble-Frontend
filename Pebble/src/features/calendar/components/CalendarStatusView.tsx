type CalendarStatusViewProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const CalendarStatusView = ({
  title,
  description,
  actionLabel,
  onAction,
}: CalendarStatusViewProps): JSX.Element => (
  <div className="flex h-full w-full items-center justify-center px-8 text-center">
    <div className="flex max-w-[360px] flex-col items-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-token-infinite bg-btn-quaternary">
        <span className="h-2.5 w-2.5 rounded-token-infinite bg-fill-primary" />
      </div>
      <h2 className="text-title-03-sb text-text-strong">{title}</h2>
      <p className="mt-2 whitespace-pre-line text-body-02-m text-text-teritary">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="mt-5 rounded-token-infinite bg-btn-primary px-5 py-2 text-body-02-sb text-text-onFill"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);
