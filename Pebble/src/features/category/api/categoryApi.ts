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

type CategoryMutationResponse =
  | CategoryResponse
  | {
      category?: CategoryResponse;
    };

const mapCategoryMutationResponse = (data: CategoryMutationResponse | null) => {
  if (!data) {
    return null;
  }

  if ("category" in data && data.category) {
    return mapCategoryResponseToCategory(data.category);
  }

  if ("id" in data) {
    return mapCategoryResponseToCategory(data);
  }

  return null;
};

export async function getCategories(): Promise<Category[]> {
  const data = await apiRequest<GetCategoriesResponse>({
    method: "GET",
    url: "/categories",
  });

  return data?.categories.map(mapCategoryResponseToCategory) ?? [];
}

export async function getUserCategories(userId: number): Promise<Category[]> {
  const data = await apiRequest<GetCategoriesResponse>({
    method: "GET",
    url: `/users/${userId}/categories`,
  });

  return data?.categories.map(mapCategoryResponseToCategory) ?? [];
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category | null> {
  const data = await apiRequest<CategoryMutationResponse>({
    method: "POST",
    url: "/categories",
    data: mapCreateCategoryInputToRequest(input),
  });

  return mapCategoryMutationResponse(data);
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

  return mapCategoryMutationResponse(data);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/categories/${categoryId}`,
  });
}
