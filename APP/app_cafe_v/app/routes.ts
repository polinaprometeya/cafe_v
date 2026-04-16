import api from "./_api";

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
  // allow extra fields like links/meta without typing them
  [key: string]: unknown;
};

export const getMenuByCategory = (): Promise<PaginatedCategoryResponse> =>
  api.apiRequest("/category");

