// @/features/auth/pages/SignUpPage.tsx
import { useLayoutEffect, useRef, useState } from 'react';

import { Header } from "../components/Header";
import { SignUpContainer } from "../containers/SignUpContainer";

export const SignUpPage = (): JSX.Element => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentScale, setContentScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      const viewport = viewportRef.current;
      const content = contentRef.current;

      if (!viewport || !content) return;

      const availableWidth = viewport.clientWidth - 32;
      const availableHeight = viewport.clientHeight - 68;
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
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-white [font-family:'Pretendard',sans-serif]" data-id="signup-screen">
      {/* Pebble 로고 GNB 네비게이션 헤더 */}
      <Header />
      
      {/* 정중앙 배치용 컨텐츠 래퍼 영역 */}
      <div
        ref={viewportRef}
        className="mx-auto flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-[16px] pb-[68px]"
      >
        <div
          ref={contentRef}
          className="w-full max-w-[506px] origin-center"
          style={{ transform: `scale(${contentScale})` }}
        >
          <SignUpContainer />
        </div>
      </div>
    </main>
  );
};
