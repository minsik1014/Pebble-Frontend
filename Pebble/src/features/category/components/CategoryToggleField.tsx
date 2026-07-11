type CategoryToggleFieldProps = {
  label: string;
  checked: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
  description?: string;
  onToggle: () => void;
};

export const CategoryToggleField = ({
  label,
  checked,
  checkedLabel,
  uncheckedLabel,
  description,
  onToggle,
}: CategoryToggleFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-body-01-sb text-text-primary">{label}</label>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className={`w-12 h-7 rounded-full relative transition-colors ${
          checked ? "bg-fill-primary" : "bg-[#d4d4d4]"
        }`}
      >
        <div
          className={`w-6 h-6 bg-fill-inverse rounded-full absolute top-[2px] transition-all ${
            checked ? "left-[22px]" : "left-[2px]"
          }`}
        />
      </button>
      {checkedLabel && uncheckedLabel && (
        <span className="text-body-02-m text-text-secondary">
          {checked ? checkedLabel : uncheckedLabel}
        </span>
      )}
    </div>
    {description && (
      <span className="text-xs text-text-teritary whitespace-nowrap">{description}</span>
    )}
  </div>
);
