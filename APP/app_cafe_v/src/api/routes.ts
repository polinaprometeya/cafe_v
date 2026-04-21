import { apiRequest } from "./api";

export type MenuItem = {
  id: number | string;
  number?: number;
  name: string;
  description?: string;
  price?: number;
};

export type Category = {
  id: number | string;
  type: string;
  menu: MenuItem[];
};

export type PaginatedCategoryResponse = {
  data: Category[];
  [key: string]: unknown;
};

export const getMenuByCategory = (): Promise<PaginatedCategoryResponse> =>
  apiRequest("/category");

