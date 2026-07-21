import { useId, useRef } from "react";
import { CATEGORY_PRESET_COLORS } from "@/utils/categoryColorTheme";

type CategoryColorPickerProps = {
  selectedColor: string;
  onSelectColor: (color: string) => void;
};

export const CategoryColorPicker = ({
  selectedColor,
  onSelectColor,
}: CategoryColorPickerProps) => {
  const colorInputId = useId();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isCustomColorSelected = !CATEGORY_PRESET_COLORS.some(
    (color) => color.toLowerCase() === selectedColor.toLowerCase(),
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-01-sb text-text-primary flex items-center gap-1">
        색상 선택 <span className="text-fill-danger text-body-01-sb">*</span>
      </label>

      <div className="flex items-center gap-2">
        {CATEGORY_PRESET_COLORS.map((color, index) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();

          return (
            <button
              key={color}
              type="button"
              onClick={() => onSelectColor(color)}
              className={`relative h-10 w-10 rounded-token-s transition-transform ${
                isSelected ? "" : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`기본 색상 ${index + 1}`}
            >
              {isSelected && (
                <span
                  className="absolute -left-1 -top-1 h-12 w-12 rounded-2xl border-[1.5px]"
                  style={{ borderColor: color }}
                />
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          className="relative h-10 w-10 rounded-token-s bg-fill-inverse p-1 transition-transform hover:scale-105"
          style={
            isCustomColorSelected
              ? {
                  backgroundColor: selectedColor,
                  border: "none",
                }
              : {
                  background:
                    "linear-gradient(#ffffff, #ffffff) padding-box, conic-gradient(#ff3b30, #ff9500, #ffcc00, #34c759, #00cef5, #bf73fd, #ff3b30) border-box",
                  border: "2px solid transparent",
                }
          }
          aria-label="직접 색상 선택"
          aria-controls={colorInputId}
        >
          {isCustomColorSelected && (
            <span
              className="absolute -left-1 -top-1 h-12 w-12 rounded-2xl border-[1.5px]"
              style={{ borderColor: selectedColor }}
            />
          )}
          {!isCustomColorSelected && (
            <span className="relative block h-full w-full rounded-[8px] border border-border-default bg-fill-inverse" />
          )}
        </button>
        <input
          ref={colorInputRef}
          id={colorInputId}
          type="color"
          value={selectedColor}
          onChange={(event) => onSelectColor(event.target.value)}
          className="sr-only"
          aria-label="직접 색상 선택"
        />
      </div>
    </div>
  );
};
