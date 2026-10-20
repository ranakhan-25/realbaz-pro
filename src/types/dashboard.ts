export interface StatCardData {
  title: string;
  count: number;
  color: string;
}

export interface ProjectData {
  id: number;
  name: string;
  status: "ON TRACK" | "AT RISK" | "IN TROUBLE";
  completePercent: number;
  budgetPercent: number;
  duration: string;
  members: number;
  totalTasks: number;
  completedTasks: number;
}

export interface StatusSummaryData {
  name: string;
  value: number;
  color: string;
}

export interface FinancialProgressData {
  name: string;
  runningProgress: number;
  financialProgress: number;
}

export interface PendingVoucherData {
  id: number;
  reference: string;
  project: string;
  contact: string;
  addedBy: string;
  date: string;
  statusText: string;
  badge: string;
}
