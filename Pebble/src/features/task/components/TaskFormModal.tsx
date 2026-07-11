import React, { useState, useEffect } from "react";
import { type Category } from "@/types";

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  defaultCategoryId?: string | null;
  defaultMilestoneId?: string | null;
  mode?: "create" | "edit";
  onRequestDelete?: () => void;
};

type DateType = "하루" | "기간" | "다중";

export const TaskFormModal = ({ 
  isOpen, 
  onClose, 
  categories,
  defaultCategoryId = null,
  defaultMilestoneId = null,
  mode = "create",
  onRequestDelete,
}: TaskFormModalProps) => {
  const [taskName, setTaskName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultCategoryId);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(defaultMilestoneId);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMilestoneDropdownOpen, setIsMilestoneDropdownOpen] = useState(false);
  const [dateType, setDateType] = useState<DateType>("하루");
  
  // Update defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(defaultCategoryId);
      setSelectedMilestone(defaultMilestoneId);
      setTaskName("");
      setDateType("하루");
      setSelectedDate(null);
      setDateRange({ start: null, end: null });
      setMultiDates([]);
    }
  }, [isOpen, defaultCategoryId, defaultMilestoneId]);

  // Date Picker State
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const [multiDates, setMultiDates] = useState<Date[]>([]);

  if (!isOpen) return null;

  const activeCategory = categories.find(c => c.id === selectedCategory);
  const availableMilestones = activeCategory?.items || [];

  // Calendar logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    
    if (dateType === "하루") {
      setSelectedDate(clickedDate);
    } else if (dateType === "다중") {
      setMultiDates(prev => {
        const exists = prev.find(d => d.getTime() === clickedDate.getTime());
        if (exists) {
          return prev.filter(d => d.getTime() !== clickedDate.getTime());
        } else {
          return [...prev, clickedDate];
        }
      });
    } else if (dateType === "기간") {
      setDateRange(prev => {
        if (!prev.start || (prev.start && prev.end)) {
          // Reset to just start
          return { start: clickedDate, end: null };
        } else {
          // Has start but no end
          if (clickedDate.getTime() < prev.start.getTime()) {
             return { start: clickedDate, end: prev.start };
          }
          return { start: prev.start, end: clickedDate };
        }
      });
    }
  };

  const getDayStatus = (day: number) => {
    const d = new Date(currentYear, currentMonth, day).getTime();
    
    if (dateType === "하루") {
      if (selectedDate?.getTime() === d) return "selected";
    } else if (dateType === "다중") {
      if (multiDates.some(md => md.getTime() === d)) return "selected";
    } else if (dateType === "기간") {
      if (dateRange.start && dateRange.end) {
        const start = dateRange.start.getTime();
        const end = dateRange.end.getTime();
        if (d === start && d === end) return "selected";
        if (d === start) return "range-start";
        if (d === end) return "range-end";
        if (d > start && d < end) return "in-range";
      } else if (dateRange.start) {
        if (d === dateRange.start.getTime()) return "selected";
      }
    }
    
    const isTodayFlag = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    return isTodayFlag ? "today" : "none";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[640px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-5 shadow-shadow-m relative">
        <h2 className="text-[24px] font-semibold text-text-strong leading-[1.3] tracking-[-0.24px]">
          {mode === "edit" ? "태스크 편집" : "태스크 추가하기"}
        </h2>

        {/* Form Inputs Container */}
        <div className="flex flex-col gap-3 w-full mt-2">
          
          {/* Row 1: Dropdowns */}
          <div className="flex items-center gap-3 w-full">
            {/* Category Dropdown */}
            <div className="relative flex-[1]">
              <button 
                className="w-full h-[48px] bg-fill-surface border border-border-secondary rounded-[12px] flex items-center justify-between px-5"
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setIsMilestoneDropdownOpen(false);
                }}
              >
                {selectedCategory ? (
                  <div className="flex items-center gap-2 w-full relative">
                    <div className={`w-[6px] h-[24px] rounded-[4px] ${activeCategory?.themeBase || 'bg-black'}`} />
                    <span className="text-[16px] text-text-strong font-medium">
                      {activeCategory?.title}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center w-full relative">
                    <span className="text-[16px] text-text-strong font-medium">카테고리</span>
                  </div>
                )}
                <div className="absolute right-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12 15L17 10H7Z" fill="#171717"/>
                  </svg>
                </div>
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute top-[52px] left-0 w-full bg-fill-inverse border border-border-default rounded-[12px] shadow-shadow-m z-20 max-h-[200px] overflow-y-auto flex flex-col gap-1 p-2">
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      className="flex items-center gap-2 p-2 hover:bg-fill-surface rounded-[8px] transition-colors text-left"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedMilestone(null); // Reset milestone when category changes
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      <div className={`w-[6px] h-[24px] rounded-[4px] ${cat.themeBase || 'bg-black'}`} />
                      <span className="text-[16px] font-medium text-text-strong">{cat.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Milestone Dropdown */}
            <div className="relative flex-[1]">
              <button 
                className="w-full h-[48px] bg-fill-surface border border-border-secondary rounded-[12px] flex items-center justify-between px-5"
                onClick={() => {
                  if (activeCategory) setIsMilestoneDropdownOpen(!isMilestoneDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                }}
              >
                {selectedMilestone ? (
                  <div className="flex items-center gap-2 w-full relative">
                    <div className={`w-[6px] h-[24px] rounded-[4px] ${activeCategory?.themeMid || 'bg-black/50'}`} />
                    <span className="text-[16px] text-text-strong font-medium">
                      {availableMilestones.find(m => m.id === selectedMilestone)?.title}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center w-full relative">
                    <span className="text-[16px] text-text-strong font-medium">마일스톤</span>
                  </div>
                )}
                <div className="absolute right-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12 15L17 10H7Z" fill="#171717"/>
                  </svg>
                </div>
              </button>
              {isMilestoneDropdownOpen && (
                <div className="absolute top-[52px] left-0 w-full bg-fill-inverse border border-border-default rounded-[12px] shadow-shadow-m z-20 max-h-[200px] overflow-y-auto flex flex-col gap-1 p-2">
                  {availableMilestones.length > 0 ? (
                    availableMilestones.map(ms => (
                      <button 
                        key={ms.id} 
                        className="flex items-center gap-2 p-2 hover:bg-fill-surface rounded-[8px] transition-colors text-left"
                        onClick={() => {
                          setSelectedMilestone(ms.id);
                          setIsMilestoneDropdownOpen(false);
                        }}
                      >
                        <div className={`w-[6px] h-[24px] rounded-[4px] ${activeCategory?.themeMid || 'bg-black/50'}`} />
                        <span className="text-[16px] font-medium text-text-strong">{ms.title}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-center text-text-teritary text-sm">
                      마일스톤이 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Name Input */}
          <div className="w-full">
            <input 
              type="text" 
              placeholder="태스크 이름을 입력해 주세요"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full h-[48px] bg-fill-inverse border border-border-default rounded-[12px] px-4 text-[16px] font-medium text-text-strong placeholder:text-text-quaternary outline-none focus:border-border-primary transition-colors"
            />
          </div>
        </div>

        {/* Date Types Segmented Control */}
        <div className="flex gap-3 w-full mt-2">
          {(["하루", "기간", "다중"] as DateType[]).map(type => (
            <button
              key={type}
              onClick={() => setDateType(type)}
              className={`flex-[1] px-5 py-3 rounded-[12px] flex flex-col items-center justify-center gap-1 transition-colors ${
                dateType === type ? "bg-btn-primary text-text-onFill" : "bg-btn-quaternary text-text-strong"
              }`}
            >
              <span className={`text-[16px] font-medium tracking-[-0.16px] leading-[1.5] ${dateType === type ? "text-fill-inverse" : "text-text-strong"}`}>
                {type}
              </span>
              <span className={`text-[14px] tracking-[-0.14px] leading-[1.5] ${dateType === type ? "text-fill-inverse opacity-80" : "text-text-secondary"}`}>
                {type === "하루" ? "특정한 날만" : type === "기간" ? "시작부터 끝까지" : "여러 날을 골라 담아"}
              </span>
            </button>
          ))}
        </div>

        {/* Calendar Picker */}
        <div className="flex flex-col gap-4 w-full mt-3">
          <div className="flex items-center justify-center w-full relative">
            <button onClick={handlePrevMonth} className="absolute left-[35%] w-8 h-8 flex items-center justify-center rounded-full bg-fill-surface hover:bg-black/5 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#171717"/>
              </svg>
            </button>
            <span className="text-[20px] font-semibold text-text-strong tracking-[-0.2px]">
              {currentYear}년 {currentMonth + 1}월
            </span>
            <button onClick={handleNextMonth} className="absolute right-[35%] w-8 h-8 flex items-center justify-center rounded-full bg-fill-surface hover:bg-black/5 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="#171717"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-2 w-full text-center px-4">
            {["일", "월", "화", "수", "목", "금", "토"].map(day => (
              <span key={day} className="text-[14px] text-text-teritary font-medium">{day}</span>
            ))}
            
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getDayStatus(day);
              
              let wrapperClass = "w-full h-10 flex items-center justify-center relative";
              let buttonClass = "w-10 h-10 rounded-[12px] flex items-center justify-center text-[16px] font-medium transition-colors z-10 relative ";
              
              const themeBaseClass = activeCategory ? activeCategory.themeBase : "bg-btn-primary";
              const themeLightClass = activeCategory ? activeCategory.themeLight : "bg-black/5";

              if (status === "selected" || status === "range-start" || status === "range-end") {
                buttonClass += `${themeBaseClass} text-fill-inverse`;
              } else if (status === "today") {
                buttonClass += "bg-fill-surface text-text-strong";
              } else if (status === "in-range") {
                buttonClass += "text-text-strong";
              } else {
                buttonClass += `text-text-strong hover:${themeLightClass}`;
              }

              if (status === "range-start") {
                wrapperClass += ` before:absolute before:right-0 before:top-0 before:w-1/2 before:h-full before:${themeLightClass}`;
              } else if (status === "range-end") {
                wrapperClass += ` before:absolute before:left-0 before:top-0 before:w-1/2 before:h-full before:${themeLightClass}`;
              } else if (status === "in-range") {
                wrapperClass += ` ${themeLightClass}`;
              }
              
              return (
                <div key={day} className={wrapperClass}>
                  <button
                    onClick={() => handleDateClick(day)}
                    className={buttonClass}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 w-full mt-4">
          {mode === "edit" && (
            <button
              onClick={onRequestDelete}
              className="w-11 h-11 bg-fill-danger rounded-[12px] flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              aria-label="삭제"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="white"/>
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-[1] h-11 bg-btn-quaternary text-text-strong rounded-[12px] font-medium hover:bg-black/5 transition-colors"
          >
            취소
          </button>
          <button
            className="flex-[1] h-11 bg-btn-primary text-text-onFill rounded-[12px] font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={
              !selectedCategory || 
              !selectedMilestone ||
              !taskName || 
              (dateType === "하루" && !selectedDate) ||
              (dateType === "기간" && (!dateRange.start || !dateRange.end)) ||
              (dateType === "다중" && multiDates.length === 0)
            }
          >
            {mode === "edit" ? "수정" : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
};
