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
      className={`relative h-[298px] overflow-hidden rounded-token-s text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-border-primary ${backgroundClassName}`}
      aria-label={`${title} 상세 보기`}
    >
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-16">
        <h3 className="text-body-01-sb text-text-onFill">{title}</h3>
      </div>
    </button>
  );
};
