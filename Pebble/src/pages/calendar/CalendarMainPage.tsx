import { MonthlyCalendarSection } from "@/features/milestone/components/MonthlyCalendarSection";
import { ProjectScheduleSidebarSection } from "@/features/milestone/components/ProjectScheduleSidebarSection";
import { useEffect, useState } from "react";

export const CalendarMainPage = (): JSX.Element => {
  const [scale, setScale] = useState(1);

  // 실제 컨텐츠의 원본 총 크기 (사이드바 476 + 갭 42 + 달력 898 = 1416px, 높이 1000px)
  const ORIGINAL_WIDTH = 1416;
  const ORIGINAL_HEIGHT = 1000;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 상하좌우 여유 패딩(여백)을 조금 둡니다 (약 60px)
      const availableWidth = width - 60;
      const availableHeight = height - 60;

      // 화면에 꽉 차게 들어가기 위한 가로/세로 배율 계산
      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;
      
      // 세로나 가로 중 '더 좁은 쪽'에 맞춰야 스크롤이 생기지 않습니다.
      // 모니터가 크면 원본 크기(1배율)를 그대로 보존합니다.
      const newScale = Math.min(widthScale, heightScale, 1);
      
      // 너무 극단적으로 작아지는 것을 막기 위해 최소 50%까지만 줄어들게 설정
      setScale(Math.max(0.5, newScale));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main
      className="bg-back w-full min-h-screen flex items-center justify-center overflow-hidden"
      data-id="main-screen"
    >
      {/* 축소된 만큼 실제 DOM 영역도 줄여주어 스크롤바가 생기지 않도록 방어하는 래퍼 */}
      <div 
        style={{ 
          width: ORIGINAL_WIDTH * scale, 
          height: ORIGINAL_HEIGHT * scale 
        }} 
        className="relative"
      >
        <div 
          className="flex gap-[42px] absolute left-0 top-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <ProjectScheduleSidebarSection />
          <MonthlyCalendarSection />
        </div>
      </div>
    </main>
  );
};
