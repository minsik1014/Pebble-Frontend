import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

import CloseIcon from "@/assets/icons/Close.svg?react";
import { getCroppedImageUrl } from "@/components/ui/image-crop/cropImage";
import {
  ACCEPTED_IMAGE_TYPES,
  validateImageFile,
} from "@/components/ui/image-crop/imageCropConfig";

type ImageCropShape = "round" | "rect";

type ImageCropModalProps = {
  isOpen: boolean;
  imageUrl: string | null;
  imageFile?: File | null;
  title: string;
  description: string;
  closeLabel: string;
  applyLabel?: string;
  changeImageLabel?: string;
  aspect?: number;
  cropShape?: ImageCropShape;
  onClose: () => void;
  onChangeImage: (imageUrl: string) => void;
};

export const ImageCropModal = ({
  isOpen,
  imageUrl,
  imageFile = null,
  title,
  description,
  closeLabel,
  applyLabel = "적용",
  changeImageLabel = "이미지 변경",
  aspect = 1,
  cropShape = "round",
  onClose,
  onChangeImage,
}: ImageCropModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createdObjectUrlRef = useRef<string | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(imageUrl);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const revokeCreatedObjectUrl = useCallback(() => {
    if (createdObjectUrlRef.current) {
      URL.revokeObjectURL(createdObjectUrlRef.current);
      createdObjectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      revokeCreatedObjectUrl();
      return;
    }

    revokeCreatedObjectUrl();

    const nextImageUrl = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

    if (imageFile) {
      createdObjectUrlRef.current = nextImageUrl;
    }

    setSourceImageUrl(nextImageUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setErrorMessage("");
  }, [imageFile, imageUrl, isOpen, revokeCreatedObjectUrl]);

  useEffect(
    () => () => revokeCreatedObjectUrl(),
    [revokeCreatedObjectUrl],
  );

  const handleCropComplete = useCallback(
    (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(nextCroppedAreaPixels);
    },
    [],
  );

  const handleSelectImage = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const validationMessage = validateImageFile(file);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    revokeCreatedObjectUrl();

    const nextImageUrl = URL.createObjectURL(file);

    createdObjectUrlRef.current = nextImageUrl;
    setSourceImageUrl(nextImageUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setErrorMessage("");
  };

  const handleApply = async () => {
    if (!sourceImageUrl || !croppedAreaPixels) {
      return;
    }

    const croppedImageUrl = await getCroppedImageUrl(
      sourceImageUrl,
      croppedAreaPixels,
      rotation,
    );

    if (!croppedImageUrl) {
      return;
    }

    onChangeImage(croppedImageUrl);
    handleClose();
  };

  const handleClose = () => {
    revokeCreatedObjectUrl();

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <section className="flex w-[640px] flex-col gap-6 rounded-[32px] bg-fill-inverse p-8 shadow-shadow-m">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-title-02-sb text-text-strong">
              {title}
            </h2>
            <p className="mt-2 text-body-02-m text-text-teritary">
              {description}
            </p>
          </div>
          <button
            type="button"
            aria-label={closeLabel}
            className="flex size-11 items-center justify-center rounded-token-s text-text-secondary hover:bg-fill-surface"
            onClick={handleClose}
          >
            <CloseIcon className="size-6" />
          </button>
        </header>

        <div className="relative h-[360px] overflow-hidden rounded-token-m bg-fill-surface">
          {sourceImageUrl ? (
            <Cropper
              image={sourceImageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              cropShape={cropShape}
              objectFit="cover"
              restrictPosition
              showGrid={false}
              minZoom={1}
              maxZoom={3}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          ) : (
            <button
              type="button"
              className="flex h-full w-full flex-col items-center justify-center gap-3 text-text-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-title-03-sb text-text-strong">
                이미지 선택하기
              </span>
              <span className="text-body-02-m text-text-teritary">
                JPG, PNG, WEBP 파일을 업로드할 수 있습니다.
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-4">
            <span className="w-16 text-body-02-m text-text-secondary">확대</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-2 flex-1 cursor-pointer accent-fill-primary"
              disabled={!sourceImageUrl}
            />
          </label>
          <label className="flex items-center gap-4">
            <span className="w-16 text-body-02-m text-text-secondary">회전</span>
            <input
              type="range"
              min={-45}
              max={45}
              step={1}
              value={rotation}
              onChange={(event) => setRotation(Number(event.target.value))}
              className="h-2 flex-1 cursor-pointer accent-fill-primary"
              disabled={!sourceImageUrl}
            />
          </label>
        </div>

        {errorMessage && (
          <p className="text-body-03-r text-fill-danger">{errorMessage}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="hidden"
          onChange={(event) => {
            handleSelectImage(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        <footer className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="h-11 rounded-token-s bg-btn-quaternary px-5 text-body-02-m text-text-strong hover:bg-btn-pressed"
            onClick={() => fileInputRef.current?.click()}
          >
            {changeImageLabel}
          </button>
          <button
            type="button"
            className="h-11 rounded-token-s bg-btn-primary px-5 text-body-02-m text-text-onFill disabled:bg-btn-teritary"
            disabled={!sourceImageUrl || !croppedAreaPixels}
            onClick={handleApply}
          >
            {applyLabel}
          </button>
        </footer>
      </section>
    </div>
  );
};
