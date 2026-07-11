import { useState } from "react";
import { type Category } from "@/types";
import DeleteIcon from "@/assets/icons/Delete.svg?react";
import { ScheduleDatePicker } from "@/components/ui/ScheduleDatePicker";
import { useScheduleDatePicker } from "@/hooks/useScheduleDatePicker";

type MilestoneFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  mode?: "create" | "edit";
  onRequestDelete?: () => void;
};

export const MilestoneFormModal = ({ isOpen, onClose, categories, mode = "create", onRequestDelete }: MilestoneFormModalProps) => {
  const [milestoneName, setMilestoneName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const datePicker = useScheduleDatePicker();
  const activeCategory = categories.find((category) => category.id === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[640px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-10 shadow-shadow-m relative">
        <h2 className="text-[24px] font-semibold text-text-strong leading-[1.4] tracking-[-0.24px]">
          {mode === "edit" ? "마일스톤 수정하기" : "마일스톤 추가하기"}
        </h2>

        {/* Inputs */}
        <div className="flex items-center gap-4 w-full">
          {/* Category Dropdown */}
          <div className="relative flex-[4]">
            <button 
              className="w-full h-[48px] bg-fill-inverse border border-border-primary rounded-[12px] flex items-center justify-between px-4"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              {selectedCategory ? (
                <div className="flex items-center gap-2">
                  <div className={`w-[6px] h-[24px] rounded-[4px] ${categories.find(c => c.id === selectedCategory)?.themeBase || 'bg-black'}`} />
                  <span className="text-[16px] text-text-primary">
                    {categories.find(c => c.id === selectedCategory)?.title}
                  </span>
                </div>
              ) : (
                <span className="text-[16px] text-text-primary">카테고리</span>
              )}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10H7Z" fill="#171717"/>
              </svg>
            </button>
            {isCategoryDropdownOpen && (
              <div className="absolute top-[52px] left-0 w-full bg-fill-inverse border border-border-default rounded-[12px] shadow-shadow-m z-10 max-h-[200px] overflow-y-auto flex flex-col gap-1 p-2">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    className="flex items-center gap-2 p-2 hover:bg-fill-surface rounded-[8px] transition-colors text-left"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    <div className={`w-[6px] h-[24px] rounded-[4px] ${cat.themeBase || 'bg-black'}`} />
                    <span className="text-[16px] text-text-strong">{cat.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Name Input */}
          <div className="flex-[6]">
            <input 
              type="text" 
              placeholder="마일스톤 이름을 입력해 주세요"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              className="w-full h-[48px] bg-transparent border border-border-default rounded-[12px] px-4 text-[16px] text-text-strong placeholder:text-text-teritary outline-none focus:border-border-primary transition-colors"
            />
          </div>
        </div>

        <ScheduleDatePicker
          variant="milestone"
          dateType={datePicker.dateType}
          onDateTypeChange={datePicker.setDateType}
          currentYear={datePicker.currentYear}
          currentMonth={datePicker.currentMonth}
          daysInMonth={datePicker.daysInMonth}
          firstDay={datePicker.firstDay}
          onPrevMonth={datePicker.handlePrevMonth}
          onNextMonth={datePicker.handleNextMonth}
          onDateClick={datePicker.handleDateClick}
          getDayStatus={datePicker.getDayStatus}
          themeBaseClass={activeCategory?.themeBase}
          themeLightClass={activeCategory?.themeLight}
        />

        {/* Bottom Actions */}
        <div className="flex gap-3 w-full mt-4">
          {mode === "edit" && (
            <button
              onClick={onRequestDelete}
              className="w-11 h-11 bg-fill-danger rounded-token-s flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              aria-label="삭제"
            >
              <DeleteIcon className="w-6 h-6 text-fill-inverse" />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-btn-quaternary text-text-strong rounded-token-s font-medium hover:bg-black/5 transition-colors"
          >
            취소
          </button>
          <button
            className="flex-1 h-11 bg-btn-primary text-text-onFill rounded-token-s font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !selectedCategory || 
              !milestoneName || 
              !datePicker.isDateSelectionComplete
            }
          >
            {mode === "edit" ? "수정" : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
};
