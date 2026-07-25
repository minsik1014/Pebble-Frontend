// src/pages/landing/LandingPage.tsx

import { PublicHeader } from '@/components/layout/PublicHeader';
import { BridgeSection } from '@/features/landing/components/BridgeSection';
import { FeaturePanelsSection } from '@/features/landing/components/FeaturePanelsSection';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingFigmaSection } from '@/features/landing/components/LandingFigmaSection';
import { LandingShell } from '@/features/landing/components/LandingShell';
import { StepStructureSection } from '@/features/landing/components/StepStructureSection';

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

        <LandingFigmaSection height={1024}>
          <StepStructureSection />
        </LandingFigmaSection>

        <LandingFigmaSection height={1024}>
          <BridgeSection />
        <LandingFigmaSection height={3072}>
          <FeaturePanelsSection />
        </LandingFigmaSection>
      </div>
    </LandingShell>
  );
}