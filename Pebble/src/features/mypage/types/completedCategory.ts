import type { Category } from "@/types";

export type CompletedCategoryDetail = {
  category: Category;
  isPrivate: boolean;
  progress: number;
  cardBackgroundClassName: string;
};
