import { useState } from "react";

type AddScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddScheduleModal = ({ isOpen, onClose }: AddScheduleModalProps) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[500px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-6 shadow-shadow-m relative">
        <header className="flex items-center justify-between">
          <h2 className="text-heading-02 text-text-strong">
            일정 추가하기
          </h2>
        </header>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-body-01-sb text-text-primary flex items-center gap-1">
              일정 이름 <span className="text-fill-danger text-body-01-sb">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정 이름을 입력하세요"
              className="w-full p-3 bg-fill-inverse border border-border-default rounded-token-s text-body-02-m text-text-strong placeholder:text-text-quaternary placeholder:font-medium focus:outline-none focus:border-text-strong transition-colors"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-body-01-sb text-text-primary flex items-center gap-1">
                시작일 <span className="text-fill-danger text-body-01-sb">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 bg-fill-inverse border border-border-default rounded-token-s text-body-02-m text-text-strong focus:outline-none focus:border-text-strong transition-colors"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-body-01-sb text-text-primary">
                종료일
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 bg-fill-inverse border border-border-default rounded-token-s text-body-02-m text-text-strong focus:outline-none focus:border-text-strong transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 bg-btn-quaternary text-text-strong rounded-token-s font-medium hover:bg-btn-pressed transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 bg-btn-primary text-text-onFill rounded-token-s font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!title || !startDate}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};
