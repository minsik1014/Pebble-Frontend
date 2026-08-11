import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { Header } from './Header';

const HORIZONTAL_PADDING = 32;
const BOTTOM_PADDING = 54;

interface AuthPageLayoutProps {
  children: ReactNode;
  dataId: string;
}

export const AuthPageLayout = ({
  children,
  dataId,
}: AuthPageLayoutProps): JSX.Element => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentScale, setContentScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      const viewport = viewportRef.current;
      const content = contentRef.current;

      if (!viewport || !content) return;

      const availableWidth = viewport.clientWidth - HORIZONTAL_PADDING;
      const availableHeight = viewport.clientHeight - BOTTOM_PADDING;
      const widthScale = availableWidth / content.scrollWidth;
      const heightScale = availableHeight / content.scrollHeight;

      setContentScale(Math.min(widthScale, heightScale, 1));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(viewportRef.current);
    resizeObserver.observe(contentRef.current);
    window.visualViewport?.addEventListener('resize', updateScale);

    return () => {
      resizeObserver.disconnect();
      window.visualViewport?.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <main
      className="flex h-dvh w-full flex-col overflow-hidden bg-fill-inverse [font-family:'Pretendard',sans-serif]"
      data-id={dataId}
      data-theme="light"
    >
      <Header />
      <div
        ref={viewportRef}
        className="mx-auto flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-[16px] pb-[54px]"
      >
        <div
          ref={contentRef}
          className="w-full max-w-[570px] origin-center"
          style={{ transform: `scale(${contentScale})` }}
        >
          {children}
        </div>
      </div>
    </main>
  );
};
