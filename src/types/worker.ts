export interface Worker {
  id: string | number;
  code: string;
  name: string;
  business?: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit?: string;
  dueDate?: string;
  under: 'Contractor' | 'Worker';
  ledgerEntries?: {
    id: string | number;
    date: string;
    project: string;
    description: string;
    voucherNo: string;
    debit: number;
    credit: number;
    balance: number;
    note?: string;
  }[];
}