import { apiRequest } from "@/services/api";
import {
  mapCategoryResponseToCategory,
  mapCreateCategoryInputToRequest,
  mapUpdateCategoryInputToRequest,
} from "./categoryMapper";
import type { Category } from "@/types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import type {
  CategoryResponse,
  GetCategoriesResponse,
} from "./categoryApi.types";

export async function getCategories(): Promise<Category[]> {
  const data = await apiRequest<GetCategoriesResponse>({
    method: "GET",
    url: "/categories",
  });

  return data?.categories.map(mapCategoryResponseToCategory) ?? [];
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category | null> {
  const data = await apiRequest<CategoryResponse>({
    method: "POST",
    url: "/categories",
    data: mapCreateCategoryInputToRequest(input),
  });

  return data ? mapCategoryResponseToCategory(data) : null;
}

export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput,
): Promise<Category | null> {
  const data = await apiRequest<CategoryResponse>({
    method: "PATCH",
    url: `/categories/${categoryId}`,
    data: mapUpdateCategoryInputToRequest(input),
  });

  return data ? mapCategoryResponseToCategory(data) : null;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/categories/${categoryId}`,
  });
}
