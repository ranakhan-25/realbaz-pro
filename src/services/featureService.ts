import api from "@/lib/api";

export interface FeatureModule {
  id: number | string;
  name: string;
}

export interface Feature {
  id: number | string;
  name: string;
  description?: string | null;
  moduleId: number | string;
  module?: FeatureModule | null;
  uuid: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleDropdownResponse {
  success: boolean;
  data: FeatureModule[];
  timestamp?: string;
  path?: string;
  statusCode?: number;
}

export interface FeaturesResponse {
  success: boolean;
  data: {
    data: Feature[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious?: boolean;
    };
  };
  timestamp: string;
  path: string;
  statusCode: number;
}

export interface GetFeaturesParams {
  page?: number;
  limit?: number;
  search?: string;
  moduleId?: number;
}

const DEMO_FEATURES: Feature[] = [
  {
    id: 1,
    name: "User Management",
    description: "Manage users, roles, and authentication access.",
    moduleId: 1,
    module: { id: 1, name: "Admin" },
    uuid: 101,
    createdAt: "2026-09-01T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Property Search",
    description: "Browse and filter available property listings.",
    moduleId: 2,
    module: { id: 2, name: "CRM" },
    uuid: 102,
    createdAt: "2026-09-05T09:00:00.000Z",
  },
  {
    id: 3,
    name: "Inventory Tracking",
    description: "Track stock levels, purchases, and item movement.",
    moduleId: 3,
    module: { id: 3, name: "Inventory" },
    uuid: 103,
    createdAt: "2026-09-08T09:00:00.000Z",
  },
  {
    id: 4,
    name: "Procurement Approval",
    description: "Review and approve procurement requests.",
    moduleId: 4,
    module: { id: 4, name: "Procurement" },
    uuid: 104,
    createdAt: "2026-09-09T09:00:00.000Z",
  },
];

function getDemoFeatureResponse(
  params: GetFeaturesParams = {},
): FeaturesResponse["data"] {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search?.trim().toLowerCase() ?? "";
  const moduleId = params.moduleId;

  const filtered = DEMO_FEATURES.filter((feature) => {
    const matchesSearch =
      !search ||
      feature.name.toLowerCase().includes(search) ||
      (feature.description ?? "").toLowerCase().includes(search);

    const matchesModule =
      !moduleId || Number(feature.moduleId) === Number(moduleId);

    return matchesSearch && matchesModule;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data: filtered.slice((page - 1) * limit, page * limit),
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

export async function getFeatures(
  params: GetFeaturesParams = {},
): Promise<FeaturesResponse["data"]> {
  try {
    const response = await api.get<FeaturesResponse>("/features", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.moduleId ? { moduleId: params.moduleId } : {}),
      },
    });

    return response.data.data;
  } catch (error) {
    console.warn("Falling back to demo feature data:", error);
    return getDemoFeatureResponse(params);
  }
}

export async function getFeature(id: string | number): Promise<Feature> {
  try {
    const response = await api.get<{ success: boolean; data: Feature }>(
      `/features/${id}`,
    );

    return response.data.data;
  } catch (error) {
    console.warn("Falling back to demo detail data:", error);
    const fallback = DEMO_FEATURES.find(
      (feature) => String(feature.id) === String(id),
    );
    if (fallback) return fallback;
    return DEMO_FEATURES[0];
  }
}

export async function getModuleDropdown(): Promise<FeatureModule[]> {
  try {
    const response = await api.get<ModuleDropdownResponse>("/modules/dropdown");

    return response.data.data;
  } catch (error) {
    console.warn("Falling back to demo module dropdown:", error);
    return [
      { id: 1, name: "Admin" },
      { id: 2, name: "CRM" },
      { id: 3, name: "Inventory" },
      { id: 4, name: "Procurement" },
    ];
  }
}

export interface CreateFeaturePayload {
  name: string;
  description?: string;
  moduleId: number;
}

export async function createFeature(
  payload: CreateFeaturePayload,
): Promise<Feature> {
  try {
    const response = await api.post<{ success: boolean; data: Feature }>(
      "/features",
      payload,
    );

    return response.data.data;
  } catch (error) {
    console.warn("Feature create fallback used:", error);
    const created: Feature = {
      id: Date.now(),
      name: payload.name,
      description: payload.description ?? "Demo created feature",
      moduleId: payload.moduleId,
      module: { id: payload.moduleId, name: "Demo Module" },
      uuid: Date.now(),
      createdAt: new Date().toISOString(),
    };
    DEMO_FEATURES.unshift(created);
    return created;
  }
}

export interface UpdateFeaturePayload {
  name?: string;
  description?: string;
  moduleId?: number;
}

export async function updateFeature(
  id: string | number,
  payload: UpdateFeaturePayload,
): Promise<Feature> {
  try {
    const response = await api.patch<{ success: boolean; data: Feature }>(
      `/features/${id}`,
      payload,
    );

    return response.data.data;
  } catch (error) {
    console.warn("Feature update fallback used:", error);
    const existing = DEMO_FEATURES.find(
      (feature) => String(feature.id) === String(id),
    );
    const updated: Feature = existing
      ? {
          ...existing,
          name: payload.name ?? existing.name,
          description: payload.description ?? existing.description,
          moduleId: payload.moduleId ?? existing.moduleId,
          module: payload.moduleId
            ? { id: payload.moduleId, name: "Updated Module" }
            : existing.module,
          updatedAt: new Date().toISOString(),
        }
      : {
          id: Date.now(),
          name: payload.name ?? "Demo Feature",
          description: payload.description ?? "Demo updated feature",
          moduleId: payload.moduleId ?? 1,
          module: { id: payload.moduleId ?? 1, name: "Demo Module" },
          uuid: Date.now(),
          createdAt: new Date().toISOString(),
        };

    const idx = DEMO_FEATURES.findIndex(
      (feature) => String(feature.id) === String(id),
    );
    if (idx >= 0) DEMO_FEATURES[idx] = updated;
    else DEMO_FEATURES.unshift(updated);
    return updated;
  }
}

export async function deleteFeature(id: string | number) {
  try {
    const response = await api.delete(`/features/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Feature delete fallback used:", error);
    const idx = DEMO_FEATURES.findIndex(
      (feature) => String(feature.id) === String(id),
    );
    if (idx >= 0) DEMO_FEATURES.splice(idx, 1);
    return { success: true };
  }
}

export async function getFeatureTree(moduleId?: number) {
  try {
    const response = await api.get("/features/tree-permissions", {
      params: moduleId ? { moduleId } : undefined,
    });

    return response.data.data;
  } catch (error) {
    console.warn("Feature tree fallback used:", error);
    return [];
  }
}

export async function getSimpleFeatures(moduleId?: number) {
  try {
    const response = await api.get("/features/simple", {
      params: moduleId ? { moduleId } : undefined,
    });

    return response.data.data;
  } catch (error) {
    console.warn("Simple features fallback used:", error);
    return DEMO_FEATURES.filter((feature) =>
      moduleId ? Number(feature.moduleId) === moduleId : true,
    );
  }
}

export async function getFeatureDropdown(moduleId?: number) {
  try {
    const response = await api.get("/features/dropdown", {
      params: moduleId ? { moduleId } : undefined,
    });

    return response.data.data;
  } catch (error) {
    console.warn("Feature dropdown fallback used:", error);
    return DEMO_FEATURES.filter((feature) =>
      moduleId ? Number(feature.moduleId) === moduleId : true,
    ).map((feature) => ({ id: feature.id, name: feature.name }));
  }
}
