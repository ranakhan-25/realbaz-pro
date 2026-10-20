import api from "@/lib/api";

export interface RolePermission {
  id: number | string;
  uuid?: string;
  name: string;
  key: string;
  description?: string | null;
  resource?: string | null;
  action?: string;
  context?: string;
  featureId?: number | string;
  feature?: {
    id: number | string;
    name: string;
    module?: {
      id: number | string;
      name: string;
    };
  };
}

export interface Role {
  id: number | string;
  uuid?: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  permissions?: RolePermission[];
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
  timestamp?: string;
  path?: string;
  statusCode?: number;
}

export interface RoleDropdown {
  id: number | string;
  name: string;
  description?: string | null;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}

export interface CreateRoleWithPermissionsPayload {
  name: string;
  description?: string;
  permissionIds: number[];
}

export async function getRoles(): Promise<Role[]> {
  const response = await api.get<RolesResponse>("/roles");

  return Array.isArray(response.data?.data) ? response.data.data : [];
}

export async function getRole(id: string | number): Promise<Role> {
  const response = await api.get<{ success: boolean; data: Role }>(
    `/roles/${id}`,
  );

  return response.data.data;
}

export async function createRole(payload: CreateRolePayload) {
  const response = await api.post("/roles", payload);

  return response.data;
}

export async function createRoleWithPermissions(
  payload: CreateRoleWithPermissionsPayload,
) {
  const response = await api.post("/roles/with-permissions", payload);

  return response.data;
}

export async function updateRole(
  id: string | number,
  payload: Partial<CreateRolePayload>,
) {
  const response = await api.patch(`/roles/${id}`, payload);

  return response.data;
}

export async function deleteRole(id: string | number) {
  const response = await api.delete(`/roles/${id}`);

  return response.data;
}

export async function getRoleDropdown(): Promise<RoleDropdown[]> {
  const response = await api.get("/roles/dropdown");

  return Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];
}

export async function getRolePermissions(
  id: string | number,
  moduleId?: number,
) {
  const response = await api.get(`/roles/${id}/permissions`, {
    params: moduleId ? { moduleId } : undefined,
  });

  return response.data.data;
}

export async function assignPermission(
  roleId: string | number,
  permissionId: string | number,
) {
  const response = await api.post(
    `/roles/${roleId}/permissions/${permissionId}`,
  );

  return response.data;
}

export async function removePermission(
  roleId: string | number,
  permissionId: string | number,
) {
  const response = await api.delete(
    `/roles/${roleId}/permissions/${permissionId}`,
  );

  return response.data;
}

export async function assignPermissionsBulk(
  roleId: string | number,
  permissionIds: number[],
) {
  const response = await api.post(
    `/roles/${roleId}/permissions/bulk`,
    permissionIds,
  );

  return response.data;
}
