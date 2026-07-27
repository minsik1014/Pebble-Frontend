import { apiClient } from "@/services/api";
import type { ApiResponse } from "@/services/api";

type UploadImageResponse = {
  imageUrl: string;
};

function dataUrlToFile(dataUrl: string, fileName: string) {
  const [meta, base64] = dataUrl.split(",");
  const mimeType = meta.match(/data:(.*);base64/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: mimeType });
}

export async function uploadImageFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.request<ApiResponse<UploadImageResponse>>({
    method: "POST",
    url: "/uploads/image",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data?.imageUrl ?? null;
}

export async function uploadImageDataUrl(dataUrl: string) {
  return uploadImageFile(dataUrlToFile(dataUrl, "category-image.png"));
}
