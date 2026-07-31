
import type { RefObject } from 'react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

interface UseLockedStepScrollParams {
  sectionRef: RefObject<HTMLElement>;
  stepCount: number;
  stepScrollDistance: number;
  transitionDuration: number;
}

const BLOCKED_SCROLL_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  ' ',
]);

function clampStep(
  step: number,
  stepCount: number,
) {
  return Math.min(
    stepCount - 1,
    Math.max(0, step),
  );
}

export function useLockedStepScroll({
  sectionRef,
  stepCount,
  stepScrollDistance,
  transitionDuration,
}: UseLockedStepScrollParams) {
  const [activeStep, setActiveStep] = useState(0);

  const activeStepRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const isInitializedRef = useRef(false);

  const transitionTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId = 0;

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

    const clearTransitionTimer = () => {
      if (transitionTimerRef.current === null) {
        return;
      }

      window.clearTimeout(
        transitionTimerRef.current,
      );

      transitionTimerRef.current = null;
    };

    const unlockTransition = () => {
      clearTransitionTimer();
      isTransitioningRef.current = false;
    };

    const lockTransition = () => {
      if (
        prefersReducedMotion ||
        transitionDuration <= 0
      ) {
        isTransitioningRef.current = false;
        return;
      }

      clearTransitionTimer();

      isTransitioningRef.current = true;

      transitionTimerRef.current =
        window.setTimeout(() => {
          isTransitioningRef.current = false;
          transitionTimerRef.current = null;
        }, transitionDuration);
    };

    const isSectionPinned = () => {
      const section = sectionRef.current;

      if (!section) return false;

      const sectionRect =
        section.getBoundingClientRect();

      /*
       * 소수점 렌더링 오차를 고려해 1px 여유를 둡니다.
       */
      return (
        sectionRect.top <= 1 &&
        sectionRect.bottom >=
          window.innerHeight - 1
      );
    };

    const moveToStepPosition = (
      nextStep: number,
      sectionTop: number,
    ) => {
      /*
       * 큰 wheel delta로 실제 문서 스크롤이 여러 단계 앞까지
       * 이동했더라도 현재 변경한 한 단계 위치로 되돌립니다.
       *
       * 카드 자체의 CSS transition이 애니메이션을 담당하므로
       * 문서 스크롤에는 smooth를 사용하지 않습니다.
       */
      window.scrollTo({
        top:
          sectionTop +
          nextStep * stepScrollDistance,
        behavior: 'auto',
      });
    };

    const updateActiveStep = () => {
      animationFrameId = 0;

      const section = sectionRef.current;

      if (!section || stepCount <= 0) {
        return;
      }

      /*
       * 카드 전환 애니메이션이 진행 중일 때는
       * scroll 이벤트가 발생해도 단계를 다시 계산하지 않습니다.
       */
      if (isTransitioningRef.current) {
        return;
      }

      const sectionRect =
        section.getBoundingClientRect();

      const sectionTop =
        window.scrollY + sectionRect.top;

      const passedDistance = Math.max(
        -sectionRect.top,
        0,
      );

      const targetStep = clampStep(
        Math.floor(
          passedDistance /
            stepScrollDistance,
        ),
        stepCount,
      );

      const previousStep =
        activeStepRef.current;

      /*
       * 새로고침으로 섹션 중간에서 시작한 경우에는
       * 애니메이션 없이 현재 위치에 맞는 단계를 적용합니다.
       */
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        activeStepRef.current = targetStep;
        setActiveStep(targetStep);
        return;
      }

      if (targetStep === previousStep) {
        return;
      }

      /*
       * 스크롤 거리가 여러 단계의 기준점을 통과했더라도
       * 상태는 한 번에 한 단계만 변경합니다.
       */
      const direction =
        targetStep > previousStep ? 1 : -1;

      const nextStep = clampStep(
        previousStep + direction,
        stepCount,
      );

      activeStepRef.current = nextStep;
      setActiveStep(nextStep);

      lockTransition();

      /*
       * 문서 위치도 변경한 단계의 기준점으로 맞춰
       * 애니메이션 종료 후 다음 스크롤에서 한 단계씩 진행되게 합니다.
       */
      moveToStepPosition(
        nextStep,
        sectionTop,
      );
    };

    const requestStepUpdate = () => {
      if (animationFrameId !== 0) {
        return;
      }

      animationFrameId =
        window.requestAnimationFrame(
          updateActiveStep,
        );
    };

    const handleWheel = (
      event: WheelEvent,
    ) => {
      if (
        !isTransitioningRef.current ||
        !isSectionPinned()
      ) {
        return;
      }

      event.preventDefault();
    };

    const handleTouchMove = (
      event: TouchEvent,
    ) => {
      if (
        !isTransitioningRef.current ||
        !isSectionPinned()
      ) {
        return;
      }

      event.preventDefault();
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        !isTransitioningRef.current ||
        !isSectionPinned() ||
        !BLOCKED_SCROLL_KEYS.has(event.key)
      ) {
        return;
      }

      event.preventDefault();
    };

    updateActiveStep();

    window.addEventListener(
      'scroll',
      requestStepUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      'resize',
      requestStepUpdate,
    );

    window.addEventListener(
      'wheel',
      handleWheel,
      {
        passive: false,
      },
    );

    window.addEventListener(
      'touchmove',
      handleTouchMove,
      {
        passive: false,
      },
    );

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'scroll',
        requestStepUpdate,
      );

      window.removeEventListener(
        'resize',
        requestStepUpdate,
      );

      window.removeEventListener(
        'wheel',
        handleWheel,
      );

      window.removeEventListener(
        'touchmove',
        handleTouchMove,
      );

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }

      unlockTransition();
    };
  }, [
    sectionRef,
    stepCount,
    stepScrollDistance,
    transitionDuration,
  ]);

  return activeStep;
}