const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://backend.garmentech.online/hrm/api/v1";

/* =========================================================
   ORGANIZATION USER
========================================================= */

export interface OrganizationUser {
  id: number;
  uuid?: string;

  avatarUrl?: string;

  email: string;
  username: string;

  firstName?: string;
  lastName?: string;
  phone?: string;

  isActive: boolean;

  createdAt: string;
  updatedAt?: string;
  createdById?: number;

  userType?: "organization" | string;

  organizationName?: string;
  organizationId?: number | string;

  designationId?: number;
  employeeId?: number | string;

  roleIds?: number[];
  moduleIds?: number[];
  permissionIds?: number[];
  categoryIds?: number[];
  companyIds?: number[];

  distributionId?: number;
  warehouseId?: number;
  receivingPointId?: number;
  factoryId?: number;
  unitId?: number;

  officeIds?: number[];
  officeTypeIds?: number[];
  sectionIds?: number[];
}

/* =========================================================
   GET ORGANIZATION USERS PARAMS
========================================================= */

export interface GetOrganizationUsersParams {
  page?: number;
  limit?: number;

  search?: string;

  isActive?: boolean | string;

  userType?: string | string[];

  sortField?: string;
  sortOrder?: "ASC" | "DESC";

  organizationId?: number | string;

  distributionId?: number;
  warehouseId?: number;
  factoryId?: number;
  departmentId?: number;
  designationId?: number;
  sectionId?: number;
  unitId?: number;
  companyId?: number;
}

/* =========================================================
   BASE ORGANIZATION USER PAYLOAD
========================================================= */

export interface BaseOrganizationUserPayload {
  email: string;

  firstName: string;

  lastName: string;

  phone?: string;

  username: string;

  isActive: boolean;

  /**
   * Organization user type is fixed.
   */
  userType: "organization";

  organizationName?: string;

  organizationId?: number | string;

  designationId?: number;

  employeeId?: number;

  roleIds?: number[];

  moduleIds?: number[];

  categoryIds?: number[];

  companyIds?: number[];

  distributionId?: number;

  warehouseId?: number;

  receivingPointId?: number;

  factoryId?: number;

  unitId?: number;

  officeIds?: number[];

  officeTypeIds?: number[];

  sectionIds?: number[];
}

/* =========================================================
   CREATE ORGANIZATION USER PAYLOAD
========================================================= */

export interface CreateOrganizationUserPayload extends BaseOrganizationUserPayload {
  password: string;

  confirmPassword?: string;
}

/* =========================================================
   UPDATE ORGANIZATION USER PAYLOAD
========================================================= */

export interface UpdateOrganizationUserPayload extends BaseOrganizationUserPayload {
  password?: string;

  confirmPassword?: string;
}

/* =========================================================
   PAGINATION
========================================================= */

export interface PaginationMeta {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNext?: boolean;

  hasPrevious?: boolean;
}

/* =========================================================
   GET USERS RESPONSE
========================================================= */

export interface GetOrganizationUsersResponse {
  success: true;

  data: OrganizationUser[];

  meta: PaginationMeta;
}

/* =========================================================
   HEADERS
========================================================= */

function getHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    Accept: "application/json",

    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/* =========================================================
   PARSE RESPONSE
========================================================= */

async function parseResponse<T = unknown>(response: Response): Promise<T> {
  const text = await response.text();

  let result: unknown = null;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = text;
  }

  if (!response.ok) {
    console.error("Organization User API Error:", {
      status: response.status,
      statusText: response.statusText,
      response: result,
    });

    let message = "";

    if (typeof result === "string") {
      message = result;
    }

    if (typeof result === "object" && result !== null && "message" in result) {
      const backendMessage = (
        result as {
          message?: unknown;
        }
      ).message;

      if (typeof backendMessage === "string") {
        message = backendMessage;
      }

      if (Array.isArray(backendMessage)) {
        message = backendMessage
          .map((item) => {
            if (typeof item === "string") {
              return item;
            }

            if (
              typeof item === "object" &&
              item !== null &&
              "message" in item
            ) {
              return String(
                (
                  item as {
                    message?: unknown;
                  }
                ).message ?? "",
              );
            }

            return String(item);
          })
          .filter(Boolean)
          .join(", ");
      }
    }

    if (typeof result === "object" && result !== null && "error" in result) {
      const backendError = (
        result as {
          error?: unknown;
        }
      ).error;

      if (typeof backendError === "string") {
        message = backendError;
      }
    }

    if (typeof result === "object" && result !== null && "errors" in result) {
      const errors = (
        result as {
          errors?: unknown;
        }
      ).errors;

      if (Array.isArray(errors)) {
        const messages = errors
          .map((item) => {
            if (typeof item === "string") {
              return item;
            }

            if (typeof item === "object" && item !== null) {
              const obj = item as {
                message?: unknown;
                msg?: unknown;
                error?: unknown;
              };

              return obj.message ?? obj.msg ?? obj.error ?? "";
            }

            return "";
          })
          .filter(Boolean)
          .map(String);

        if (messages.length > 0) {
          message = messages.join(", ");
        }
      }
    }

    if (!message) {
      message = `Request failed with status code ${response.status}`;
    }

    throw new Error(message);
  }

  return result as T;
}

/* =========================================================
   TYPE HELPERS
========================================================= */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* =========================================================
   CHECK ORGANIZATION USER
========================================================= */

function looksLikeOrganizationUser(value: unknown): value is OrganizationUser {
  if (!isRecord(value)) {
    return false;
  }

  return "id" in value || "uuid" in value;
}

/* =========================================================
   UNWRAP SINGLE ORGANIZATION USER
========================================================= */

function unwrapOrganizationUser(result: unknown): OrganizationUser {
  if (looksLikeOrganizationUser(result)) {
    return result;
  }

  if (isRecord(result) && looksLikeOrganizationUser(result.data)) {
    return result.data;
  }

  if (
    isRecord(result) &&
    isRecord(result.data) &&
    looksLikeOrganizationUser(result.data.data)
  ) {
    return result.data.data;
  }

  if (isRecord(result) && looksLikeOrganizationUser(result.user)) {
    return result.user;
  }

  console.error("Unexpected organization user response:", result);

  throw new Error(
    "Organization user was saved, but the server response was in an unexpected format.",
  );
}

/* =========================================================
   GET ORGANIZATION USERS
========================================================= */

export async function getOrganizationUsers(
  params: GetOrganizationUsersParams = {},
): Promise<GetOrganizationUsersResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));

  searchParams.set("limit", String(params.limit ?? 50));

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.isActive !== undefined && params.isActive !== "") {
    searchParams.set("isActive", String(params.isActive));
  }

  /*
   * Organization users only.
   */

  if (params.userType) {
    if (Array.isArray(params.userType)) {
      params.userType.forEach((type) => {
        searchParams.append("userType", type);
      });
    } else {
      searchParams.set("userType", params.userType);
    }
  } else {
    searchParams.set("userType", "organization");
  }

  if (params.organizationId !== undefined) {
    searchParams.set("organizationId", String(params.organizationId));
  }

  searchParams.set("sortField", params.sortField ?? "created_at");

  searchParams.set("sortOrder", params.sortOrder ?? "DESC");

  if (params.distributionId !== undefined) {
    searchParams.set("distributionId", String(params.distributionId));
  }

  if (params.warehouseId !== undefined) {
    searchParams.set("warehouseId", String(params.warehouseId));
  }

  if (params.factoryId !== undefined) {
    searchParams.set("factoryId", String(params.factoryId));
  }

  if (params.departmentId !== undefined) {
    searchParams.set("departmentId", String(params.departmentId));
  }

  if (params.designationId !== undefined) {
    searchParams.set("designationId", String(params.designationId));
  }

  if (params.sectionId !== undefined) {
    searchParams.set("sectionId", String(params.sectionId));
  }

  if (params.unitId !== undefined) {
    searchParams.set("unitId", String(params.unitId));
  }

  if (params.companyId !== undefined) {
    searchParams.set("companyId", String(params.companyId));
  }

  const url = `${API_BASE_URL}/users?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",

    headers: getHeaders(),

    cache: "no-store",
  });

  const result = await parseResponse<unknown>(response);

  if (!isRecord(result) || result.success !== true) {
    throw new Error(
      isRecord(result) && typeof result.message === "string"
        ? result.message
        : "Unable to load organization users.",
    );
  }

  const data = isRecord(result.data) ? result.data : {};

  const users = Array.isArray(data.data)
    ? data.data.filter(looksLikeOrganizationUser)
    : [];

  const meta: PaginationMeta = isRecord(data.meta)
    ? {
        page:
          typeof data.meta.page === "number"
            ? data.meta.page
            : (params.page ?? 1),

        limit:
          typeof data.meta.limit === "number"
            ? data.meta.limit
            : (params.limit ?? 50),

        total:
          typeof data.meta.total === "number" ? data.meta.total : users.length,

        totalPages:
          typeof data.meta.totalPages === "number" ? data.meta.totalPages : 1,

        hasNext:
          typeof data.meta.hasNext === "boolean" ? data.meta.hasNext : false,

        hasPrevious:
          typeof data.meta.hasPrevious === "boolean"
            ? data.meta.hasPrevious
            : false,
      }
    : {
        page: params.page ?? 1,
        limit: params.limit ?? 50,
        total: users.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };

  return {
    success: true,
    data: users,
    meta,
  };
}

/* =========================================================
   GET SINGLE ORGANIZATION USER
========================================================= */

export async function getOrganizationUser(
  uuid: string | number,
  includePermissions = false,
): Promise<OrganizationUser> {
  const query = includePermissions ? "?includePermissions=true" : "";

  const response = await fetch(`${API_BASE_URL}/users/${uuid}${query}`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const result = await parseResponse<unknown>(response);

  return unwrapOrganizationUser(result);
}

/* =========================================================
   CREATE ORGANIZATION USER
========================================================= */

export async function createOrganizationUser(
  payload: CreateOrganizationUserPayload,
): Promise<OrganizationUser> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",

    headers: getHeaders(),

    body: JSON.stringify({
      ...payload,

      userType: "organization",
    }),
  });

  const result = await parseResponse<unknown>(response);

  return unwrapOrganizationUser(result);
}

/* =========================================================
   UPDATE ORGANIZATION USER
========================================================= */

export async function updateOrganizationUser(
  uuid: string | number,
  payload: UpdateOrganizationUserPayload,
): Promise<OrganizationUser> {
  const response = await fetch(`${API_BASE_URL}/users/${uuid}`, {
    method: "PATCH",

    headers: getHeaders(),

    body: JSON.stringify({
      ...payload,

      userType: "organization",
    }),
  });

  const result = await parseResponse<unknown>(response);

  return unwrapOrganizationUser(result);
}

/* =========================================================
   DELETE ORGANIZATION USER
========================================================= */

export async function deleteOrganizationUser(
  uuid: string | number,
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/users/${uuid}`, {
    method: "DELETE",

    headers: getHeaders(),
  });

  await parseResponse<unknown>(response);

  return true;
}

/* =========================================================
   DROPDOWN OPTION
========================================================= */

export interface DropdownOption {
  id: number | string;

  name: string;
}

/* =========================================================
   FORM DROPDOWN RESPONSE
========================================================= */

export interface OrganizationUserFormDropdowns {
  designations: DropdownOption[];

  categories: DropdownOption[];

  employees: DropdownOption[];

  modules: DropdownOption[];

  roles: DropdownOption[];

  companies: DropdownOption[];

  organizations: DropdownOption[];
}

/* =========================================================
   EXTRACT ARRAY
========================================================= */

function extractArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return [];
  }

  const keys = [
    "data",
    "items",
    "results",
    "content",
    "records",
    "rows",
    "list",
    "options",
  ];

  for (const key of keys) {
    const nested = value[key];

    if (Array.isArray(nested)) {
      return nested;
    }

    const result = extractArray(nested);

    if (result.length) {
      return result;
    }
  }

  return [];
}

/* =========================================================
   NORMALIZE OPTIONS
========================================================= */

function normalizeOptions(value: unknown): DropdownOption[] {
  return extractArray(value)
    .map((item): DropdownOption | null => {
      if (!isRecord(item)) {
        return null;
      }

      const id = item.id;
      const name = item.name;

      if (typeof id !== "number" && typeof id !== "string") {
        return null;
      }

      if (typeof name !== "string" && typeof name !== "number") {
        return null;
      }

      return {
        id,

        name: String(name),
      };
    })
    .filter((item): item is DropdownOption => item !== null);
}

/* =========================================================
   GET JSON
========================================================= */

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    method: "GET",

    headers: getHeaders(),

    cache: "no-store",
  });

  return parseResponse<unknown>(response);
}

/* =========================================================
   PICK DROPDOWN
========================================================= */

function pickDropdown(source: unknown, keys: string[]): DropdownOption[] {
  if (!isRecord(source)) {
    return [];
  }

  for (const key of keys) {
    if (source[key] !== undefined) {
      const result = normalizeOptions(source[key]);

      if (result.length) {
        return result;
      }
    }
  }

  for (const value of Object.values(source)) {
    if (isRecord(value)) {
      const result = pickDropdown(value, keys);

      if (result.length) {
        return result;
      }
    }
  }

  return [];
}

/* =========================================================
   GET ORGANIZATION USER FORM DROPDOWNS
========================================================= */

export async function getOrganizationUserFormDropdowns(): Promise<OrganizationUserFormDropdowns> {
  const [base, designations, modules, roles, companies, organizations] =
    await Promise.all([
      getJson(`${API_BASE_URL}/users/dropdown/list`),

      getJson(`${API_BASE_URL}/designation/dropdown`),

      getJson(`${API_BASE_URL}/modules/dropdown`),

      getJson(`${API_BASE_URL}/roles/dropdown`),

      getJson(`${API_BASE_URL}/companies`),

      getJson(`${API_BASE_URL}/organizations/dropdown`),
    ]);

  return {
    designations: normalizeOptions(designations),

    categories: pickDropdown(base, ["categories", "category"]),

    employees: pickDropdown(base, ["employees", "employee"]),

    modules: normalizeOptions(modules),

    roles: normalizeOptions(roles),

    companies: normalizeOptions(companies),

    organizations: normalizeOptions(organizations),
  };
}

/* =========================================================
   ORGANIZATION USER DROPDOWN
========================================================= */

export interface OrganizationUserDropdownParams {
  organizationId?: number | string;

  distributionId?: number;

  warehouseId?: number;

  factoryId?: number;

  departmentId?: number;

  designationId?: number;

  sectionId?: number;

  unitId?: number;

  search?: string;
}

export async function getOrganizationUserDropdown(
  params?: OrganizationUserDropdownParams,
) {
  const query = new URLSearchParams();

  query.set("userType", "organization");

  if (params?.organizationId !== undefined) {
    query.set("organizationId", String(params.organizationId));
  }

  if (params?.distributionId !== undefined) {
    query.set("distributionId", String(params.distributionId));
  }

  if (params?.warehouseId !== undefined) {
    query.set("warehouseId", String(params.warehouseId));
  }

  if (params?.factoryId !== undefined) {
    query.set("factoryId", String(params.factoryId));
  }

  if (params?.departmentId !== undefined) {
    query.set("departmentId", String(params.departmentId));
  }

  if (params?.designationId !== undefined) {
    query.set("designationId", String(params.designationId));
  }

  if (params?.sectionId !== undefined) {
    query.set("sectionId", String(params.sectionId));
  }

  if (params?.unitId !== undefined) {
    query.set("unitId", String(params.unitId));
  }

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  const queryString = query.toString();

  const response = await fetch(
    `${API_BASE_URL}/users/dropdown/list${
      queryString ? `?${queryString}` : ""
    }`,
    {
      method: "GET",

      headers: getHeaders(),

      cache: "no-store",
    },
  );

  return parseResponse<unknown>(response);
}

/* =========================================================
   ROLE
========================================================= */

export async function assignOrganizationUserRole(
  userId: number,
  roleId: number,
): Promise<unknown> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/roles/${roleId}`,
    {
      method: "POST",

      headers: getHeaders(),
    },
  );

  return parseResponse<unknown>(response);
}

export async function removeOrganizationUserRole(
  userId: number,
  roleId: number,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/roles/${roleId}`,
    {
      method: "DELETE",

      headers: getHeaders(),
    },
  );

  await parseResponse<unknown>(response);

  return true;
}

/* =========================================================
   PERMISSIONS
========================================================= */

export interface AddOrganizationUserPermissionsPayload {
  userId: number;

  moduleId: number;

  permissionIds: number[];
}

export async function addOrganizationUserPermissions(
  payload: AddOrganizationUserPermissionsPayload,
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/users/permissions`, {
    method: "POST",

    headers: getHeaders(),

    body: JSON.stringify(payload),
  });

  return parseResponse<unknown>(response);
}

export interface DeleteOrganizationUserPermissionsPayload {
  userId: number;

  permissionIds: number[];
}

export async function deleteOrganizationUserPermissions(
  payload: DeleteOrganizationUserPermissionsPayload,
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/users/permissions`, {
    method: "DELETE",

    headers: getHeaders(),

    body: JSON.stringify(payload),
  });

  await parseResponse<unknown>(response);

  return true;
}
