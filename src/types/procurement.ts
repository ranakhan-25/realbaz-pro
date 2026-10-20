export type ProcurementPeriod = "today" | "weekly" | "monthly" | "yearly" | "all";

export interface ProcurementStat {
  id: string;
  title: string;
  value: number;
  icon: string;
  type: "pending" | "total";

  // Optional card design data
  change?: number;
  changeLabel?: string;
  color?: "red" | "blue" | "green" | "purple" | "orange" | "cyan";
  chart?: number[];
  route: string;
}

export interface OverflowMaterial {
  id: string;
  description: string;
  budgetQty: number;
  budgetAmount: number;
  issueQty: number;
  issueAmount: number;
  status: "Pending" | "Issued" | "Completed";
}

export interface PendingVoucher {
  id: string;
  reference: string;
  project: string;
  contact: string;
  addedBy: string;
  date: string;
  saleOffer: string;
  status: string;
}
