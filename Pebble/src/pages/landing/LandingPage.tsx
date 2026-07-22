import { PublicHeader } from '@/components/layout/PublicHeader';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingFigmaSection } from '@/features/landing/components/LandingFigmaSection';
import { LandingShell } from '@/features/landing/components/LandingShell';

export function LandingPage() {
  return (
    <LandingShell>
      <div className="relative overflow-hidden bg-fill-inverse">
        <div className="absolute left-0 top-0 z-30 w-full">
          <PublicHeader variant="landing" />
        </div>

        <LandingFigmaSection height={1474}>
          <HeroSection />
        </LandingFigmaSection>
      </div>
    </LandingShell>
  );
}