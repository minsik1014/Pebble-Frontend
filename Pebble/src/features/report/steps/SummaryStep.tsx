import { useCallback, useEffect, useState, type ReactNode } from 'react';

import {
  updateReportImage,
  uploadReportImage,
} from '../api/reportApi';
import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { useSaveAsImage } from '../hooks/useSaveAsImage';
import { ScaledPreview } from '../components/ScaledPreview';
import { StepFooter } from '../components/StepFooter';
import { MonthlyPebbleSection } from '../sections/MonthlyPebbleSection';
import { BusiestCategorySection } from '../sections/BusiestCategorySection';
import { BusiestDaySection } from '../sections/BusiestDaySection';
import { SharedFriendsSection } from '../sections/SharedFriendsSection';

/** Figma R007에서 원본 리포트 카드가 합본 안에 들어가는 비율 */
const CARD_SCALE = 0.41568;
/** 저장되는 합본 이미지의 CSS 기준 너비 */
const COMPOSITE_WIDTH = 480;

const pad2 = (value: number) => String(value).padStart(2, '0');

interface MiniReportProps {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
}

/**
 * 원본 R003~R006 카드 크기를 유지한 채 Figma 비율로 축소합니다.
 * 섹션 컴포넌트를 그대로 재사용하므로 API 데이터도 합본에 동일하게 반영됩니다.
 */
function MiniReport({
  width,
  height,
  children,
  className = '',
}: MiniReportProps) {
  return (
    <div
      className="shrink-0 overflow-hidden"
      style={{ width: width * CARD_SCALE, height: height * CARD_SCALE }}
    >
      <div
        className={`overflow-hidden rounded-[20px] shadow-[0_30px_100px_rgba(23,23,23,0.05),inset_0_-3px_4px_#fff,inset_0_5px_8px_rgba(255,255,255,0.6)] ${className}`}
        style={{
          width,
          height,
          transform: `scale(${CARD_SCALE})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 작은 높이의 브라우저에서도 버튼까지 한 화면에 담기 위한 화면 표시 배율 */
function useSummaryPreviewScale() {
  const getScale = () =>
    Math.min(1, Math.max(0.68, (window.innerHeight - 140) / 780));
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const handleResize = () => setScale(getScale());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return scale;
}

/** R007 — 전체 리포트 합본 + PNG 저장 */
export function SummaryStep() {
  const { report } = useReport();
  const { goFirst } = useReportNavigation();
  const previewScale = useSummaryPreviewScale();

  const fileName = `pebble-report-${report.reportYear}-${pad2(report.reportMonth)}.png`;
  const persistReportImage = useCallback(
    async (file: File) => {
      if (!report.reportId) return;

      const reportImageUrl = await uploadReportImage(file);
      await updateReportImage(report.reportId, reportImageUrl);
    },
    [report.reportId],
  );
  const { targetRef, save, status, errorMessage } = useSaveAsImage(fileName, {
    onImageCreated: persistReportImage,
  });
  const isSaving = status === 'saving';

  return (
    <div className="mt-[calc(45px-20.4vh)] flex flex-col items-center">
      <ScaledPreview width={COMPOSITE_WIDTH} scale={previewScale}>
        {/* 이 노드는 화면 표시 배율과 무관한 원본 크기로 PNG에 저장됩니다. */}
        <div
          ref={targetRef}
          className="flex w-[480px] flex-col gap-[14.902px] rounded-[17.22px] bg-white p-[23.843px] shadow-[0_0_14px_rgba(23,23,23,0.05)]"
        >
          {/* R003 — 이번 달 조약돌 */}
          <MiniReport
            width={1040}
            height={482}
            className="bg-[rgba(250,250,250,0.4)] px-[64px]"
          >
            <MonthlyPebbleSection report={report} />
          </MiniReport>

          {/* R004 — 가장 바빴던 카테고리 */}
          <MiniReport
            width={1040}
            height={482}
            className="bg-[rgba(250,250,250,0.4)] px-[64px]"
          >
            <BusiestCategorySection category={report.busiestCategory} />
          </MiniReport>

          {/* R005 + R006 — 가장 바빴던 하루와 함께한 친구 */}
          <div className="flex items-start gap-[14.902px]">
            <MiniReport
              width={600}
              height={482}
              className="bg-[rgba(250,250,250,0.25)] p-[40px]"
            >
              <BusiestDaySection day={report.busiestDay} />
            </MiniReport>

            <MiniReport
              width={404}
              height={504}
              className="bg-[rgba(250,250,250,0.25)] p-[40px]"
            >
              <SharedFriendsSection
                sharedFriends={report.sharedFriends}
                month={report.reportMonth}
              />
            </MiniReport>
          </div>
        </div>
      </ScaledPreview>

      {errorMessage && (
        <p role="alert" className="mt-[12px] text-[14px] text-[#D9534F]">
          {errorMessage}
        </p>
      )}

      <StepFooter
        className="mt-[clamp(24px,9.4vh,96px)]"
        secondary={{ label: '처음부터 다시 보기', onClick: goFirst }}
        primary={{
          label: isSaving ? '저장 중…' : '이미지로 저장하기',
          onClick: save,
          disabled: isSaving,
        }}
      />
    </div>
  );
}
