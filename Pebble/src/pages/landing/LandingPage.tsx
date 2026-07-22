import { PublicHeader } from '@/components/layout/PublicHeader';
import { HeroBackgroundShapes } from '@/features/landing/components/HeroBackgroundShapes';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingFigmaSection } from '@/features/landing/components/LandingFigmaSection';
import { LandingShell } from '@/features/landing/components/LandingShell';

export function LandingPage() {
  return (
    <LandingShell>
      <div className="relative overflow-hidden bg-fill-inverse">
        <HeroBackgroundShapes />

        <PublicHeader variant="landing" />

        <LandingFigmaSection height={1366}>
          <HeroSection />
        </LandingFigmaSection>
      </div>
    </LandingShell>
  );
}