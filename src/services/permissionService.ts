import api from "@/lib/api";

/* =========================================================
   Permission Types
========================================================= */

export interface PermissionFeatureModule {
  id: number;
  name: string;
}

export interface PermissionFeature {
  id: number;
  name: string;
  moduleId: number;
  module?: PermissionFeatureModule;
}

export interface Permission {
  id: string;
  uuid?: string;
  key: string;
  name: string;
  description: string | null;
  resource: string | null;
  action: string;
  context: string;
  featureId?: number;
  createdAt: string;
  updatedAt: string;
  feature?: PermissionFeature;
}

/* =========================================================
   Permission List Params
========================================================= */

export interface PermissionParams {
  page?: number;
  limit?: number;
  search?: string;
  featureId?: number;
  moduleId?: number;
  resource?: string;
  action?: string;
  context?: string;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}

/* =========================================================
   Permission List Response
========================================================= */

export interface PermissionResponse {
  data: Permission[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious?: boolean;
  };
}

/* =========================================================
   CREATE PERMISSION PAYLOAD
========================================================= */

export interface CreatePermissionPayload {
  key: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  context: string;
  featureId: number;
}

/* =========================================================
   UPDATE PERMISSION PAYLOAD
========================================================= */

export interface UpdatePermissionPayload {
  key?: string;
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
  context?: string;
  featureId?: number;
}

/* =========================================================
   GET PERMISSIONS
   GET /permissions
========================================================= */

export async function getPermissions(
  params: PermissionParams = {},
): Promise<PermissionResponse> {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.featureId !== undefined) {
    query.set("featureId", String(params.featureId));
  }

  if (params.moduleId !== undefined) {
    query.set("moduleId", String(params.moduleId));
  }

  if (params.resource?.trim()) {
    query.set("resource", params.resource.trim());
  }

  if (params.action?.trim()) {
    query.set("action", params.action.trim());
  }

  if (params.context?.trim()) {
    query.set("context", params.context.trim());
  }

  query.set("sortField", params.sortField || "createdAt");
  query.set("sortOrder", params.sortOrder || "DESC");

  const response = await api.get(
    `/permissions?${query.toString()}`,
  );

  const result = response.data?.data ?? response.data;

  return {
    data: Array.isArray(result?.data)
      ? result.data
      : [],
    meta: {
      page: Number(result?.meta?.page ?? params.page ?? 1),
      limit: Number(result?.meta?.limit ?? params.limit ?? 20),
      total: Number(result?.meta?.total ?? 0),
      totalPages: Math.max(
        Number(result?.meta?.totalPages ?? 1),
        1,
      ),
      hasNext: Boolean(result?.meta?.hasNext ?? false),
      hasPrevious: Boolean(
        result?.meta?.hasPrevious ?? false,
      ),
    },
  };
}

/* =========================================================
   GET SINGLE PERMISSION
   GET /permissions/:id
========================================================= */

export async function getPermission(
  id: string,
): Promise<Permission> {
  const response = await api.get(
    `/permissions/${id}`,
  );

  return response.data?.data ?? response.data;
}

/* =========================================================
   CREATE PERMISSION
   POST /permissions
========================================================= */

export async function createPermission(
  payload: CreatePermissionPayload,
): Promise<Permission> {
  const featureId = Number(payload.featureId);

  if (!Number.isInteger(featureId) || featureId <= 0) {
    throw new Error("A valid Feature ID is required.");
  }

  const cleanPayload: CreatePermissionPayload = {
    key: payload.key.trim(),
    name: payload.name.trim(),
    description: payload.description?.trim() || "",
    resource: payload.resource.trim(),
    action: payload.action.trim(),
    context: payload.context.trim(),
    featureId,
  };

  if (!cleanPayload.key) {
    throw new Error("Permission key is required.");
  }

  if (!cleanPayload.name) {
    throw new Error("Permission name is required.");
  }

  if (!cleanPayload.resource) {
    throw new Error("Permission resource is required.");
  }

  console.log(
    "CREATE PERMISSION PAYLOAD:",
    cleanPayload,
  );

  try {
    const response = await api.post(
      "/permissions",
      cleanPayload,
    );

    return response.data?.data ?? response.data;
  } catch (error: any) {
    const backendMessage =
      error?.response?.data?.message;

    if (Array.isArray(backendMessage)) {
      throw new Error(
        backendMessage.join(", "),
      );
    }

    if (backendMessage) {
      throw new Error(
        String(backendMessage),
      );
    }

    if (error?.response?.data?.error) {
      throw new Error(
        String(error.response.data.error),
      );
    }

    throw error;
  }
}

/* =========================================================
   UPDATE PERMISSION
   PATCH /permissions/:id
========================================================= */

export async function updatePermission(
  id: string,
  payload: UpdatePermissionPayload,
): Promise<Permission> {
  const cleanPayload: UpdatePermissionPayload = {};

  if (payload.key !== undefined) {
    cleanPayload.key = payload.key.trim();
  }

  if (payload.name !== undefined) {
    cleanPayload.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    cleanPayload.description =
      payload.description.trim();
  }

  if (payload.resource !== undefined) {
    cleanPayload.resource =
      payload.resource.trim();
  }

  if (payload.action !== undefined) {
    cleanPayload.action =
      payload.action.trim();
  }

  if (payload.context !== undefined) {
    cleanPayload.context =
      payload.context.trim();
  }

  if (payload.featureId !== undefined) {
    const featureId = Number(payload.featureId);

    if (
      !Number.isInteger(featureId) ||
      featureId <= 0
    ) {
      throw new Error(
        "A valid Feature ID is required.",
      );
    }

    cleanPayload.featureId = featureId;
  }

  console.log(
    "UPDATE PERMISSION PAYLOAD:",
    cleanPayload,
  );

  try {
    const response = await api.patch(
      `/permissions/${id}`,
      cleanPayload,
    );

    return response.data?.data ?? response.data;
  } catch (error: any) {
    const backendMessage =
      error?.response?.data?.message;

    if (Array.isArray(backendMessage)) {
      throw new Error(
        backendMessage.join(", "),
      );
    }

    if (backendMessage) {
      throw new Error(
        String(backendMessage),
      );
    }

    if (error?.response?.data?.error) {
      throw new Error(
        String(error.response.data.error),
      );
    }

    throw error;
  }
}

/* =========================================================
   DELETE PERMISSION
   DELETE /permissions/:id
========================================================= */

export async function deletePermission(
  id: string,
): Promise<void> {
  await api.delete(
    `/permissions/${id}`,
  );
}