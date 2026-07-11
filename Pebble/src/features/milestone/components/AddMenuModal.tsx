

type AddMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: () => void;
  onSelectMilestone: () => void;
  onSelectTask: () => void;
};

export const AddMenuModal = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectMilestone,
  onSelectTask,
}: AddMenuModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[320px] p-[32px] bg-fill-inverse rounded-[32px] flex flex-col gap-[20px] shadow-shadow-m relative">
        <header className="flex items-center justify-between">
          <h2 className="font-semibold text-[20px] leading-[1.4] text-text-strong tracking-[-0.2px]">추가하기</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#171717"/>
            </svg>
          </button>
        </header>

        <div className="flex flex-col gap-[12px]">
          <button
            onClick={() => {
              onClose();
              onSelectCategory();
            }}
            className="w-full flex items-center justify-center h-[44px] px-[20px] bg-btn-quaternary rounded-[12px] text-[16px] font-medium text-text-strong hover:bg-black/5 transition-colors"
          >
            카테고리
          </button>
          
          <button
            onClick={() => {
              onClose();
              onSelectMilestone();
            }}
            className="w-full flex items-center justify-center h-[44px] px-[20px] bg-btn-quaternary rounded-[12px] text-[16px] font-medium text-text-strong hover:bg-black/5 transition-colors"
          >
            마일스톤
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectTask();
            }}
            className="w-full flex items-center justify-center h-[44px] px-[20px] bg-btn-quaternary rounded-[12px] text-[16px] font-medium text-text-strong hover:bg-black/5 transition-colors"
          >
            태스크
          </button>
        </div>
      </div>
    </div>
  );
};
