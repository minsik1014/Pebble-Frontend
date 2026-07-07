import BellOutlineIcon from "@/assets/icons/bell-outline.svg?react";
import SocialOutlineIcon from "@/assets/icons/social-outline.svg?react";
import CalendarSolidIcon from "@/assets/icons/calendar-nav-selected.svg?react";
import MyOutlineIcon from "@/assets/icons/user-outline.svg?react";
import SettingsOutlineIcon from "@/assets/icons/settings-outline.svg?react";
import LogOutIcon from "@/assets/icons/logout.svg?react";

export const GlobalNavigationBar = () => {
  return (
    <nav className="h-[1000px] w-[84px] shrink-0 px-5 py-8 bg-fill-inverse inline-flex flex-col justify-start items-center gap-10 overflow-hidden relative">
      <div className="flex-1 flex flex-col justify-between items-center w-full">
        {/* 상단: 알림 그룹 */}
        <div className="flex flex-col justify-start items-center gap-5 w-full">
          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <BellOutlineIcon className="size-6" />
            {/* 알림 닷 */}
            <div className="size-1 absolute right-[10px] top-[10px] bg-fill-danger rounded-full" />
          </div>
        </div>
        
        {/* 중앙: 메뉴 그룹 */}
        <div className="flex flex-col justify-start items-center gap-10 w-full">
          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <SocialOutlineIcon className="size-6" />
          </div>
          <div className="size-11 relative flex items-center justify-center rounded-token-s bg-fill-primary text-text-onFill cursor-pointer shadow-sm">
            <CalendarSolidIcon className="size-6" />
          </div>
          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <MyOutlineIcon className="size-6" />
          </div>
        </div>

        {/* 하단: 설정 그룹 */}
        <div className="flex flex-col justify-start items-center gap-10 w-full">
          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <SettingsOutlineIcon className="size-6" />
          </div>
          <div className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer hover:bg-fill-surface transition-colors text-text-secondary hover:text-text-strong">
            <LogOutIcon className="size-6" />
          </div>
        </div>
      </div>
    </nav>
  );
};
