import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

const CROP_VIEWPORT_SIZE = 320;
const OUTPUT_IMAGE_SIZE = 512;

type ProfileImageCropModalProps = {
  source: string;
  onCancel: () => void;
  onComplete: (imageUrl: string) => void;
};

type Point = {
  x: number;
  y: number;
};

const clampOffset = (
  point: Point,
  renderedWidth: number,
  renderedHeight: number,
): Point => {
  const maxX = Math.max(0, (renderedWidth - CROP_VIEWPORT_SIZE) / 2);
  const maxY = Math.max(0, (renderedHeight - CROP_VIEWPORT_SIZE) / 2);

  return {
    x: Math.min(maxX, Math.max(-maxX, point.x)),
    y: Math.min(maxY, Math.max(-maxY, point.y)),
  };
};

export const ProfileImageCropModal = ({
  source,
  onCancel,
  onComplete,
}: ProfileImageCropModalProps): JSX.Element => {
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<(Point & { offsetX: number; offsetY: number }) | null>(
    null,
  );
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  const baseScale = naturalSize.width
    ? Math.max(
        CROP_VIEWPORT_SIZE / naturalSize.width,
        CROP_VIEWPORT_SIZE / naturalSize.height,
      )
    : 1;
  const renderedWidth = naturalSize.width * baseScale * zoom;
  const renderedHeight = naturalSize.height * baseScale * zoom;

  useEffect(() => {
    setOffset((previous) =>
      clampOffset(previous, renderedWidth, renderedHeight),
    );
  }, [renderedWidth, renderedHeight]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;

    if (!dragStart) {
      return;
    }

    setOffset(
      clampOffset(
        {
          x: dragStart.offsetX + event.clientX - dragStart.x,
          y: dragStart.offsetY + event.clientY - dragStart.y,
        },
        renderedWidth,
        renderedHeight,
      ),
    );
  };

  const handleApply = () => {
    const image = imageRef.current;

    if (!image || !naturalSize.width) {
      return;
    }

    const displayScale = baseScale * zoom;
    const displayedLeft =
      (CROP_VIEWPORT_SIZE - renderedWidth) / 2 + offset.x;
    const displayedTop =
      (CROP_VIEWPORT_SIZE - renderedHeight) / 2 + offset.y;
    const sourceX = -displayedLeft / displayScale;
    const sourceY = -displayedTop / displayScale;
    const sourceSize = CROP_VIEWPORT_SIZE / displayScale;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = OUTPUT_IMAGE_SIZE;
    canvas.height = OUTPUT_IMAGE_SIZE;
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      OUTPUT_IMAGE_SIZE,
      OUTPUT_IMAGE_SIZE,
    );
    onComplete(canvas.toDataURL("image/png"));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-crop-title"
    >
      <div className="w-[440px] rounded-token-m bg-fill-inverse p-8 shadow-shadow-noti">
        <h2 id="profile-crop-title" className="text-title-03-sb text-text-strong">
          프로필 이미지 편집
        </h2>
        <p className="mt-2 text-body-03-r text-text-secondary">
          원 안에 보일 영역을 움직이고 크기를 조절해 주세요.
        </p>

        <div className="mt-7 flex justify-center">
          <div
            className="relative size-[320px] touch-none cursor-grab overflow-hidden rounded-full bg-fill-surface active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => {
              dragStartRef.current = null;
            }}
            onPointerCancel={() => {
              dragStartRef.current = null;
            }}
          >
            <img
              ref={imageRef}
              src={source}
              alt="크롭할 프로필 미리보기"
              draggable={false}
              onLoad={(event) => {
                setNaturalSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                });
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                width: renderedWidth,
                height: renderedHeight,
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/90 shadow-[inset_0_0_0_1px_rgba(23,23,23,0.25)]"
              aria-hidden="true"
            />
          </div>
        </div>

        <label className="mt-7 flex items-center gap-4 text-body-02-m text-text-secondary">
          축소
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-auto accent-fill-primary"
            aria-label="프로필 이미지 확대 비율"
          />
          확대
        </label>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 flex-1 rounded-token-s bg-btn-quaternary text-body-02-m text-text-strong transition-colors hover:bg-btn-pressed dark:hover:bg-[#373737]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!naturalSize.width}
            className="dark-disabled-primary h-12 flex-1 rounded-token-s bg-btn-primary text-body-02-m text-text-onFill disabled:cursor-not-allowed disabled:opacity-50"
          >
            적용
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
