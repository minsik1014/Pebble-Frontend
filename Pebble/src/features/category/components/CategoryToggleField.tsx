import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

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
    <ToggleSwitch
      checked={checked}
      checkedLabel={checkedLabel}
      uncheckedLabel={uncheckedLabel}
      aria-label={label}
      onToggle={onToggle}
    />
    {description && (
      <span className="text-xs text-text-teritary whitespace-nowrap">{description}</span>
    )}
  </div>
);
