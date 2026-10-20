import type {
  CreateMenuRequest,
  MenuData,
  MenuModule,
  MenuTreeNode,
  UpdateMenuRequest,
  UserModuleAssignment,
} from "@/types/interfaces/menuServices";
import type { PermittedMenu } from "@/lib/menuDataToItems";

export interface MenuTreeOrderNode {
  id: string | number;
  children?: MenuTreeOrderNode[];
}

export interface MenuModuleTreeResponseItem extends Omit<MenuModule, "name"> {
  moduleId?: string | number;
  moduleName?: string;
  name: string;
  menuTree?: MenuTreeNode[];
}

export const baseApiService = {
  injectEndpoints: () => ({}),
};

const menuApiService = {} as Record<string, unknown>;

export const useGetMenusQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetMenusQuery = () => [async () => undefined];
export const useGetMenuTreeQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetMenuTreeQuery = () => [async () => undefined];
export const useGetMenuByIdQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetMenuByIdQuery = () => [async () => undefined];
export const useCreateMenuMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useUpdateMenuMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useDeleteMenuMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useUpdateMenuOrderMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useToggleMenuStatusMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useGetMenuModulesQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetMenuModulesQuery = () => [async () => undefined];
export const useGetMenuModulesTreeQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetMenuModulesTreeQuery = () => [async () => undefined];
export const useUpdateMenuTreeOrderMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useAssignMenuPermissionsMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useAssignUserModulesMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useGetUserModulesByIdQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetUserModulesByIdQuery = () => [async () => undefined];
export const useGetOwnPermittedModulesQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetOwnPermittedModulesQuery = () => [async () => undefined];
export const useUpdateUserModulesMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useDeleteUserModulesMutation = () => [
  async () => undefined,
  { isLoading: false },
];
export const useGetPermittedMenusQuery = () => ({
  data: undefined,
  isLoading: false,
  error: null,
});
export const useLazyGetPermittedMenusQuery = () => [async () => undefined];

export default menuApiService;
