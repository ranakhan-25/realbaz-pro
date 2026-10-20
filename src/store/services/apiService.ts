export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  challanType?: string;
  goodsType?: string;
  fromDistributionId?: number;
  toDistributionId?: number;
  challanDate?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}

export const hrmPrefix = "/hrm/api/v1";
export const posPrefix = "/hrm/api/v1";
export const enginePrefix = "/hrm/api/v1";

export type RootState = Record<string, unknown>;

export const rawBaseQuery = async (..._args: unknown[]) => ({
  data: null,
  error: null,
});

export const logout = async () => undefined;
export const updateTokens = (_tokens: Record<string, string>) => undefined;

export const baseApiService = {
  reducerPath: "api",
  injectEndpoints: <T extends Record<string, unknown>>(config: {
    overrideExisting?: boolean;
    endpoints: (builder: unknown) => T;
  }) => {
    void config.overrideExisting;
    return config.endpoints({});
  },
};
