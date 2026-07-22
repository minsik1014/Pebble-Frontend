export const ACCEPTED_IMAGE_TYPE_LIST = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_IMAGE_TYPES = ACCEPTED_IMAGE_TYPE_LIST.join(",");

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
