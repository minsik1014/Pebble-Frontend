import type { Category } from "@/types";
import { createCategoryColorTheme } from "@/utils/categoryColorTheme";
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./categoryApi.types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

const mapImageUrlToRequest = (imageUrl: string | undefined) =>
  imageUrl?.startsWith("http://") || imageUrl?.startsWith("https://")
    ? imageUrl
    : null;

export function mapCategoryResponseToCategory(
  category: CategoryResponse,
): Category {
  const theme = createCategoryColorTheme(category.color);

  return {
    id: String(category.id),
    title: category.name,
    accent: theme.accent,
    themeBase: theme.themeBase,
    themeMid: theme.themeMid,
    themeLight: theme.themeLight,
    themeTextOnMid: theme.themeTextOnMid,
    themeTextOnLight: theme.themeTextOnLight,
    imageUrl: category.imageUrl ?? undefined,
    isHidden: category.isHidden,
    isPublic: category.isPublic,
    isCompleted: category.isCompleted,
    isShared: category.isShared,
    displayOrder: category.displayOrder,
    items: [],
    tasks: [],
  };
}

export function mapCreateCategoryInputToRequest(
  input: CreateCategoryInput,
): CreateCategoryRequest {
  return {
    name: input.title,
    color: input.accent,
    imageUrl: mapImageUrlToRequest(input.imageUrl),
    isPublic: input.isPublic,
    isCompleted: input.isCompleted,
  };
}

export function mapUpdateCategoryInputToRequest(
  input: UpdateCategoryInput,
): UpdateCategoryRequest {
  const request: UpdateCategoryRequest = {};

  if (input.title !== undefined) {
    request.name = input.title;
  }

  if (input.accent !== undefined) {
    request.color = input.accent;
  }

  if ("imageUrl" in input) {
    request.imageUrl = mapImageUrlToRequest(input.imageUrl);
  }

  if (input.isCompleted !== undefined) {
    request.isCompleted = input.isCompleted;
  }

  if (input.isPublic !== undefined) {
    request.isPublic = input.isPublic;
  }

  if (input.isHidden !== undefined) {
    request.isHidden = input.isHidden;
  }

  return request;
}
