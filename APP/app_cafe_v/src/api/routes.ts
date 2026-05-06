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

export type LoginRequest = {
  email: string;
  password: string;
};

// Shape depends on your Laravel response; keep it flexible and strongly type the token.
export type LoginResponse = {
  token?: string;
  access_token?: string;
  [key: string]: unknown;
};


export const login = (body: LoginRequest): Promise<LoginResponse> =>
  apiRequest("/login", { method: "POST", body });

export const logout = (token?: string | null): Promise<unknown> =>
  apiRequest("/logout", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  export const getMenuByCategory = (): Promise<PaginatedCategoryResponse> =>
    apiRequest("/category");

