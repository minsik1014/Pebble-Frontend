import type { Area } from "react-easy-crop";

const createImage = (imageUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = imageUrl;
  });

export const getCroppedImageUrl = async (
  imageUrl: string,
  croppedAreaPixels: Area,
  rotation = 0,
) => {
  const image = await createImage(imageUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const rotationRadians = (rotation * Math.PI) / 180;
  const safeArea = Math.max(image.width, image.height) * 2;

  canvas.width = safeArea;
  canvas.height = safeArea;

  context.translate(safeArea / 2, safeArea / 2);
  context.rotate(rotationRadians);
  context.translate(-safeArea / 2, -safeArea / 2);
  context.drawImage(
    image,
    safeArea / 2 - image.width / 2,
    safeArea / 2 - image.height / 2,
  );

  const imageData = context.getImageData(
    safeArea / 2 - image.width / 2 + croppedAreaPixels.x,
    safeArea / 2 - image.height / 2 + croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  );

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  context.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
};
