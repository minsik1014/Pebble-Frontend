import { PublicHeader } from '@/components/layout/PublicHeader';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingFigmaSection } from '@/features/landing/components/LandingFigmaSection';
import { LandingShell } from '@/features/landing/components/LandingShell';

export function LandingPage() {
  return (
    <LandingShell>
      <PublicHeader variant="landing" />

      <LandingFigmaSection height={1474}>
        <HeroSection />
      </LandingFigmaSection>
    </LandingShell>
  );
}