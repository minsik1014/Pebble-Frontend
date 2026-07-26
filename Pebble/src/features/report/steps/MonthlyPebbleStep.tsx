import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { ReportCard } from '../components/ReportCard';
import { StepFooter } from '../components/StepFooter';
import { MonthlyPebbleSection } from '../sections/MonthlyPebbleSection';

/** R003 — 이번 달 조약돌 (리포트 첫 화면) */
export function MonthlyPebbleStep() {
  const { report } = useReport();
  const { goNext } = useReportNavigation();

  return (
    <>
      <ReportCard>
        <MonthlyPebbleSection report={report} />
      </ReportCard>

      {/* 첫 단계라 "이전으로"가 없습니다 */}
      <StepFooter primary={{ label: '다음으로', onClick: goNext }} />
    </>
  );
}
