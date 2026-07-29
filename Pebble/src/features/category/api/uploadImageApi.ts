import { apiClient } from "@/services/api";
import type { ApiResponse } from "@/services/api";

type UploadImageResponse = {
  imageUrl: string;
};

const MAX_UPLOAD_IMAGE_SIZE = 1024;
const UPLOAD_IMAGE_QUALITY = 0.9;

const loadImage = (imageUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = imageUrl;
  });

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", UPLOAD_IMAGE_QUALITY);
  });

async function dataUrlToUploadFile(dataUrl: string, fileName: string) {
  const image = await loadImage(dataUrl);
  const scale = Math.min(
    1,
    MAX_UPLOAD_IMAGE_SIZE / Math.max(image.width, image.height),
  );
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지 업로드 파일을 생성하지 못했습니다.");
  }

  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await canvasToBlob(canvas);

  if (!blob) {
    throw new Error("이미지 업로드 파일을 생성하지 못했습니다.");
  }

  return new File([blob], fileName, { type: "image/jpeg" });
}

export async function uploadImageFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.request<ApiResponse<UploadImageResponse>>({
    method: "POST",
    url: "/uploads/image",
    data: formData,
  });

  return response.data.data?.imageUrl ?? null;
}

export async function uploadImageDataUrl(dataUrl: string) {
  return uploadImageFile(
    await dataUrlToUploadFile(dataUrl, "category-image.jpg"),
  );
}
