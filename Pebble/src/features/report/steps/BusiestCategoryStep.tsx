import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { ReportCard } from '../components/ReportCard';
import { StepFooter } from '../components/StepFooter';
import { BusiestCategorySection } from '../sections/BusiestCategorySection';

/** R004 — 이번 달 가장 바빴던 카테고리 */
export function BusiestCategoryStep() {
  const { report } = useReport();
  const { goPrev, goNext } = useReportNavigation();

  return (
    <>
      <ReportCard>
        <BusiestCategorySection category={report.busiestCategory} />
      </ReportCard>

      <StepFooter
        secondary={{ label: '이전으로', onClick: goPrev }}
        primary={{ label: '다음으로', onClick: goNext }}
      />
    </>
  );
}
