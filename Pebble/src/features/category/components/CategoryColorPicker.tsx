import { CATEGORY_COLORS } from "./categoryFormOptions";

type CategoryColorPickerProps = {
  selectedColor: number | null;
  onSelectColor: (index: number) => void;
};

const getBorderClass = (color: string) => {
  if (color === "bg-theme-1-base") return "border-theme-1-base";
  if (color === "bg-theme-2-base") return "border-theme-2-base";
  if (color === "bg-theme-3-base") return "border-theme-3-base";
  if (color === "bg-theme-4-base") return "border-theme-4-base";
  if (color === "bg-theme-5-base") return "border-theme-5-base";
  return "border-theme-6-base";
};

export const CategoryColorPicker = ({ selectedColor, onSelectColor }: CategoryColorPickerProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-body-01-sb text-text-primary flex items-center gap-1">
      색상 선택 <span className="text-fill-danger text-body-01-sb">*</span>
    </label>
    <div className="flex items-center gap-2">
      {CATEGORY_COLORS.map((color, index) => (
        <button
          key={color}
          type="button"
          onClick={() => onSelectColor(index)}
          className={`w-10 h-10 rounded-token-s relative transition-transform ${color} ${
            selectedColor !== index ? "hover:scale-105" : ""
          }`}
          aria-label={`색상 ${index + 1}`}
        >
          {selectedColor === index && (
            <div
              className={`w-12 h-12 left-[-4px] top-[-4px] absolute rounded-2xl border-[1.5px] ${getBorderClass(color)}`}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);
