import { CategoryPreviewCard } from './CategoryPreviewCard';
import { FeatureCalendarPreview } from './FeatureCalendarPreview';
import { FeaturePanel } from './FeaturePanel';
import { TaskColorPreview } from './TaskColorPreview';

export function FeaturePanelsSection() {
  return (
    <div className="relative h-[3072px] w-[1440px] bg-fill-inverse">
      <div className="absolute left-[100px] top-[200px]">
        <FeaturePanel
          title="큰 목표부터 오늘의 한 칸까지"
          description="카테고리, 마일스톤, 태스크로 계획의 크기를 나눠 차근차근 실행해요"
        >
          <CategoryPreviewCard />
        </FeaturePanel>
      </div>

      <div className="absolute left-[100px] top-[1024px]">
        <FeaturePanel
          title="계획을 나만의 방식으로"
          description="카테고리마다 원하는 색을 직접 골라, 일정을 한눈에 구분해요"
        >
          <TaskColorPreview />
        </FeaturePanel>
      </div>

      <div className="absolute left-[100px] top-[1848px]">
        <FeaturePanel
          title="달력 위에서 바로 이해하는 한 달"
          description="여러 일정을 한 눈에 확인해요"
        >
          <FeatureCalendarPreview />
        </FeaturePanel>
      </div>
    </div>
  );
}