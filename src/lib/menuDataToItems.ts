export interface PermittedMenu {
  moduleId: string;
  moduleName: string;
  menuTree?: Array<{
    id: string | number;
    title?: string;
    url?: string;
    children?: unknown[];
    [key: string]: unknown;
  }>;
}

export function menuDataToItems() {
  return [];
}
