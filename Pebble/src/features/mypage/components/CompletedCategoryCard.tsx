type CompletedCategoryCardProps = {
  title: string;
  backgroundClassName: string;
};

export const CompletedCategoryCard = ({
  title,
  backgroundClassName,
}: CompletedCategoryCardProps): JSX.Element => {
  return (
    <article
      className={`relative h-[298px] overflow-hidden rounded-token-s ${backgroundClassName}`}
    >
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-16">
        <h3 className="text-body-01-sb text-text-onFill">{title}</h3>
      </div>
    </article>
  );
};
