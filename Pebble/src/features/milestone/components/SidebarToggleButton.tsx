import React from "react";
import SidebarOpenIcon from "@/assets/icons/sidebar-open.svg?react";
import SidebarCloseIcon from "@/assets/icons/sidebar-close.svg?react";

type SidebarToggleButtonProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
};

export const SidebarToggleButton = ({
  isSidebarOpen,
  onToggle,
}: SidebarToggleButtonProps) => {
  return (
    <button 
      onClick={onToggle}
      className="flex h-11 w-11 items-center justify-center rounded-token-s bg-btn-quaternary text-text-strong hover:bg-btn-pressed transition-colors shrink-0"
      aria-label={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
    >
      {isSidebarOpen ? (
        <SidebarCloseIcon className="h-6 w-6 text-text-strong" />
      ) : (
        <SidebarOpenIcon className="h-6 w-6 text-text-strong" />
      )}
    </button>
  );
};
