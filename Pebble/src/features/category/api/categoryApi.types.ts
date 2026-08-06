export type CategoryResponse = {
  id: number;
  userId?: number;
  name: string;
  color: string;
  imageUrl?: string | null;
  isHidden?: boolean;
  isPublic?: boolean;
  isCompleted?: boolean;
  isShared?: boolean;
  displayOrder?: number;
  milestoneCount?: number;
  taskCount?: number;
  sharedTaskCount?: number;
  hasSchedules?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GetCategoriesResponse = {
  categories: CategoryResponse[];
};

export type CreateCategoryRequest = {
  name: string;
  color: string;
  imageUrl?: string | null;
  isPublic?: boolean;
  isCompleted?: boolean;
  inviteUserIds?: number[];
};

export type UpdateCategoryRequest = {
  name?: string;
  color?: string;
  imageUrl?: string | null;
  isCompleted?: boolean;
  isPublic?: boolean;
  isHidden?: boolean;
};
