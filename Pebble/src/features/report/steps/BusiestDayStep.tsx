import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { ReportCard } from '../components/ReportCard';
import { StepFooter } from '../components/StepFooter';
import { BusiestDaySection } from '../sections/BusiestDaySection';

/** R005 — 이번 달 가장 바빴던 하루 */
export function BusiestDayStep() {
  const { report } = useReport();
  const { goPrev, goNext } = useReportNavigation();

  return (
    <>
      <ReportCard className="!w-[600px] !bg-[rgba(250,250,250,0.25)] !px-[40px] !py-[40px]">
        <BusiestDaySection day={report.busiestDay} />
      </ReportCard>

      <StepFooter
        secondary={{ label: '이전으로', onClick: goPrev }}
        primary={{ label: '다음으로', onClick: goNext }}
      />
    </>
  );
}
