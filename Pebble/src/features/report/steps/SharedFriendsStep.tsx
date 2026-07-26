import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { ReportCard } from '../components/ReportCard';
import { StepFooter } from '../components/StepFooter';
import { SharedFriendsSection } from '../sections/SharedFriendsSection';

/** R006 — 공유 카테고리를 함께한 친구들 */
export function SharedFriendsStep() {
  const { report } = useReport();
  const { goPrev, goNext } = useReportNavigation();

  return (
    <>
      <ReportCard className="!h-[504px] !w-[404px] !bg-[rgba(250,250,250,0.25)] !p-[40px]">
        <SharedFriendsSection
          sharedFriends={report.sharedFriends}
          month={report.reportMonth}
        />
      </ReportCard>

      <StepFooter
        className="mt-[clamp(18px,calc(100vh-966px),40px)]"
        secondary={{ label: '이전으로', onClick: goPrev }}
        primary={{ label: '다음으로', onClick: goNext }}
      />
    </>
  );
}
