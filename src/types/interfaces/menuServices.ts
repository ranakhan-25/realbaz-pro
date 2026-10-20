export type MenuLocation = "SIDEBAR" | "HEADER" | "FOOTER" | "NOTFOUND";

export interface MenuPermission {
  id: number;
  key: string;
  description?: string;
}

export interface MenuModule {
  id: number;
  name: string;
  description?: string;
}

export interface MenuData {
  id: number;
  title: string;
  url: string;
  target?: string;
  location: MenuLocation[];
  elementClass?: string;
  elementId?: string;
  icon?: string;
  isVisible: boolean;
  description?: string;
  order: number;
  parentId?: number | null;
  moduleId?: number | null;
  parent?: MenuData | null;
  children?: MenuData[];
  module?: MenuModule;
  permissions?: MenuPermission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuRequest {
  title: string;
  url: string;
  target?: string;
  location: MenuLocation[];
  elementClass?: string;
  elementId?: string;
  icon?: string;
  isVisible: boolean;
  description?: string;
  order: number;
  parentId?: number | null;
  moduleId?: number | null;
  permissionIds?: number[];
}

export interface UpdateMenuRequest {
  title?: string;
  url?: string;
  target?: string;
  location?: MenuLocation[];
  elementClass?: string;
  elementId?: string;
  icon?: string;
  isVisible?: boolean;
  description?: string;
  order?: number;
  parentId?: number | null;
  moduleId?: number | null;
  permissionIds?: number[];
}

export interface MenuTreeNode {
  id: number;
  title: string;
  url: string;
  target?: string;
  order: number;
  location: MenuLocation;
  elementClass?: string;
  elementId?: string;
  icon?: string;
  description?: string;
  parentId?: number | null;
  isVisible: boolean;
  isPublic?: boolean;
  moduleId?: number | null;
  parent?: string | null;
  children: MenuTreeNode[];
  module?: MenuModule;
  permissions?: MenuPermission[];
}

export interface MenuModuleTree {
  moduleId: number;
  moduleName: string;
  moduleDescription?: string;
  menuTree: MenuTreeNode[];
}

export interface UserModuleAssignment {
  userId: string;
  modules: MenuModule[];
}

export interface PermittedMenu {
  moduleId: string;
  moduleName: string;
  menus: MenuTreeNode[];
}
