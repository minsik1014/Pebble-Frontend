import { useEffect, useState } from 'react';

import { GlobalNavigationBar } from '@/components/layout/GlobalNavigationBar';
import { SettingsView } from '@/features/settings/components/SettingsView';

const ORIGINAL_WIDTH = 1440;
const ORIGINAL_HEIGHT = 1024;

export default function SettingsPage() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const widthScale = window.innerWidth / ORIGINAL_WIDTH;
      const heightScale = window.innerHeight / ORIGINAL_HEIGHT;

      const nextScale = Math.min(widthScale, heightScale, 1);
      setScale(Math.max(0.5, nextScale));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-fill-inverse">
      <div
        style={{
          width: ORIGINAL_WIDTH * scale,
          height: ORIGINAL_HEIGHT * scale,
        }}
        className="relative"
      >
        <div
          className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left bg-fill-inverse"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="absolute left-[14px] top-token-m">
            <GlobalNavigationBar />
          </div>

          <div className="absolute left-[140px] top-token-m">
            <SettingsView />
          </div>
        </div>
      </div>
    </main>
  );
}