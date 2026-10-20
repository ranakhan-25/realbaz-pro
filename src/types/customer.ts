export interface Nominee {
  name: string;
  nid: string;
  phone: string;
  relation: string;
  percentage: number;
}

export interface Customer {
  id: number;
  code: string;
  name: string;
  business: string;
  mobile: string;
  email: string;
  nidPassport: string;
  under: string;
  image?: string;
  address?: string;
  buyerReference?: string;
  creditLimit?: number;
  chartOfGroups?: string;
  nominees?: Nominee[];
  landInfo?: Array<{
    project: string;
    block: string;
    plotLocation: string;
    roadSize: string;
    plotNo: string;
    totalValue: number;
    plotSize: string;
    totalReceived: number;
    due: number;
  }>;
  flatInfo?: Array<{
    project: string;
    utilityValue: number;
    flatNo: string;
    totalValue: number;
    flatSize: string;
    totalReceived: number;
    flatValue: number;
    due: number;
    parkingValue: number;
  }>;
  paymentSchedule?: Array<{
    sl: number;
    date: string;
    amount: number;
    remarks: string;
    paymentDate: string;
    paidAmount: number;
  }>;
  paymentDetails?: Array<{
    sl: number;
    date: string;
    particular: string;
    cashBankParticular: string;
    voucherNo: string;
    debit: number;
    credit: number;
    balance: number;
  }>;
}