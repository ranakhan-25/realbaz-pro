export interface Supplier {
  id: number | string;
  code: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: string;
  under: string;
}
