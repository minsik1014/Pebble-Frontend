import { useEffect, useState } from 'react';

import { GlobalNavigationBar } from '@/components/layout/GlobalNavigationBar';
import { SettingsView } from '@/features/settings/components/SettingsView';

const ORIGINAL_WIDTH = 1416;
const ORIGINAL_HEIGHT = 1000;

export default function SettingsPage() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const availableWidth = width - 24;
      const availableHeight = height - 24;

      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;

      const nextScale = Math.min(widthScale, heightScale, 1);
      setScale(Math.max(0.5, nextScale));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-fill-surface">
      <div
        style={{
          width: ORIGINAL_WIDTH * scale,
          height: ORIGINAL_HEIGHT * scale,
        }}
        className="relative"
      >
        <div
          className="absolute left-0 top-0 h-[1000px] w-[1416px] origin-top-left bg-fill-surface"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="absolute left-0 top-0">
            <GlobalNavigationBar variant="collapsed" />
          </div>

          <div className="absolute left-[100px] top-0">
            <SettingsView />
          </div>
        </div>
      </div>
    </main>
  );
}
