import { useEffect, useState } from 'react';

const ORIGINAL_WIDTH = 1416;
const ORIGINAL_HEIGHT = 1000;
const SAFE_MARGIN = 24;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const getMinimumScale = (viewportWidth: number) =>
  viewportWidth < TABLET_BREAKPOINT ? 0.42 : 0.5;

export const MAIN_LAYOUT_WIDTH = ORIGINAL_WIDTH;
export const MAIN_LAYOUT_HEIGHT = ORIGINAL_HEIGHT;

export const useMainLayoutViewport = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const availableWidth = viewportWidth - SAFE_MARGIN;
      const availableHeight = viewportHeight - SAFE_MARGIN;
      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;
      const nextScale = Math.min(widthScale, heightScale, 1);

      setIsMobile(viewportWidth < MOBILE_BREAKPOINT);
      setScale(Math.max(getMinimumScale(viewportWidth), nextScale));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, scale };
};
