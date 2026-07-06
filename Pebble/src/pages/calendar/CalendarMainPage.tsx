import { MonthlyCalendarSection } from "@/features/milestone/components/MonthlyCalendarSection";
import { ProjectScheduleSidebarSection } from "@/features/milestone/components/ProjectScheduleSidebarSection";
import { useEffect, useState } from "react";

export const CalendarMainPage = (): JSX.Element => {
  const [scale, setScale] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 전체 레이아웃의 원본 총 크기는 항상 1416px로 고정됩니다.
  // 사이드바가 닫히면 줄어든 392px만큼 캘린더가 1290px로 넓어져서 총합 1416px을 유지합니다.
  const ORIGINAL_WIDTH = 1416;
  const ORIGINAL_HEIGHT = 1000;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const availableWidth = width - 60;
      const availableHeight = height - 60;

      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;
      
      const newScale = Math.min(widthScale, heightScale, 1);
      setScale(Math.max(0.5, newScale));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ORIGINAL_WIDTH]);

  return (
    <main
      className="bg-back w-full min-h-screen flex items-center justify-center overflow-hidden transition-all duration-300"
      data-id="main-screen"
    >
      <div 
        style={{ 
          width: ORIGINAL_WIDTH * scale, 
          height: ORIGINAL_HEIGHT * scale 
        }} 
        className="relative transition-all duration-300"
      >
        <div 
          className="flex gap-[42px] absolute left-0 top-0 origin-top-left transition-all duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          <ProjectScheduleSidebarSection isSidebarOpen={isSidebarOpen} />
          <MonthlyCalendarSection 
            isSidebarOpen={isSidebarOpen} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
        </div>
      </div>
    </main>
  );
};
