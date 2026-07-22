import { PublicHeader } from '@/components/layout/PublicHeader';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingShell } from '@/features/landing/components/LandingShell';

export function LandingPage() {
  return (
    <LandingShell>
      <PublicHeader variant="landing" />
      <HeroSection />
    </LandingShell>
  );
}