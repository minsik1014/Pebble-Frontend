// src/pages/landing/LandingPage.tsx

import { PublicHeader } from '@/components/layout/PublicHeader';
import { BridgeSection } from '@/features/landing/components/BridgeSection';
import { FeaturePanelsSection } from '@/features/landing/components/FeaturePanelsSection';
import { FinalCTASection } from '@/features/landing/components/FinalCTASection';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingFigmaSection } from '@/features/landing/components/LandingFigmaSection';
import { LandingShell } from '@/features/landing/components/LandingShell';
import { ReportSection } from '@/features/landing/components/ReportSection';
import { StepStructureScrollSection } from '@/features/landing/components/StepStructureScrollSection';

export function LandingPage() {
  return (
    <LandingShell>
      <div className="relative overflow-x-clip bg-fill-inverse">
        <div className="absolute left-0 top-0 z-30 w-full">
          <PublicHeader variant="landing" />
        </div>

        <LandingFigmaSection height={1474}>
          <HeroSection />
        </LandingFigmaSection>

        <StepStructureScrollSection />

        <LandingFigmaSection height={3072}>
          <FeaturePanelsSection />
        </LandingFigmaSection>

        <LandingFigmaSection height={1024}>
          <BridgeSection />
        </LandingFigmaSection>

        <LandingFigmaSection height={1024}>
          <ReportSection />
        </LandingFigmaSection>

        <LandingFigmaSection height={1024}>
          <FinalCTASection />
        </LandingFigmaSection>
      </div>
    </LandingShell>
  );
}