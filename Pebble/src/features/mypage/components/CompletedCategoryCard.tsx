type CompletedCategoryCardProps = {
  title: string;
  backgroundClassName: string;
  onClick?: () => void;
};

export const CompletedCategoryCard = ({
  title,
  backgroundClassName,
  onClick,
}: CompletedCategoryCardProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[300px] w-[200px] overflow-hidden rounded-token-s text-left focus-visible:ring-2 focus-visible:ring-border-primary ${backgroundClassName}`}
      aria-label={`${title} 상세 보기`}
    >
      <div className="absolute inset-x-0 bottom-0 flex h-[120px] items-end bg-gradient-to-b from-[rgba(36,36,36,0)] to-[rgba(36,36,36,0.5)] p-4">
        <h3 className="max-w-[168px] truncate text-title-03-sb text-text-onFill">
          {title}
        </h3>
      </div>
    </button>
  );
};
