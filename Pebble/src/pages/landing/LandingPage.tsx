import { PublicHeader } from '@/components/layout/PublicHeader';
import { LandingShell } from '@/features/landing/components/LandingShell';

export function LandingPage() {
  return (
    <LandingShell>
      <PublicHeader variant="landing" />

      <section className="flex h-[calc(100vh-108px)] min-h-[560px] items-center justify-center">
        <div className="text-center">
          <p className="text-[20px] font-medium leading-[150%] tracking-[-0.01em] text-text-secondary">
            랜딩 페이지 콘텐츠는 다음 작업에서 구현합니다.
          </p>
        </div>
      </section>
    </LandingShell>
  );
}