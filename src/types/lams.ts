export type LeadStage =
  | "New"
  | "Contacted"
  | "In Negotiation"
  | "Legal Verification"
  | "Agreement Ready"
  | "Acquired";

export type LeadSource =
  | "Direct Owner"
  | "Broker/Agent"
  | "Bank Auction"
  | "Referral"
  | "Field Survey";

export type VerificationStatus =
  | "Verified"
  | "Under Review"
  | "Discrepancy Found"
  | "Pending";

export type NegotiationStatus =
  | "In Progress"
  | "Agreed"
  | "Revision Needed"
  | "Declined";

export type FollowUpStatus =
  | "Pending"
  | "Completed"
  | "Rescheduled"
  | "Cancelled";

export interface LandOwner {
  id: string;
  uuid?: string;
  code: string;
  acquisitionLeadId: string;
  landPlot: string;
  ownerName: string;
  isPrimary: boolean;
  fatherName: string;
  nidNumber: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive";
  addedBy: string;
  remarks?: string;
  ownershipSharePercentage?: number;
  projectId?: string;
}

export interface AcquisitionLead {
  id: string;
  uuid?: string;
  leadCode: string;
  title: string;
  address: string;
  district: string;
  upazila: string;
  mouza: string;
  dagNo: string;
  khatianNo: string;
  jlNo?: string;
  landArea: number; // in decimals (শতক)
  landAreaUnit: "Decimal" | "Katha" | "Bigha" | "Acre";
  landType: "Residential" | "Commercial" | "Mixed-use" | "Industrial" | "Agricultural";
  leadStage: LeadStage;
  leadSource: LeadSource;
  leadStatus: "Active" | "Pending" | "On Hold" | "Rejected";
  assignedUser: string;
  expectedPrice: number; // BDT
  offeredPrice: number; // BDT
  ownerName: string;
  ownerPhone: string;
  ownerAddress: string;
  createdAt: string;
  remarks?: string;
  projectId?: string;
}

export interface NegotiationRecord {
  id: string;
  uuid?: string;
  acquisitionLeadId: string;
  leadTitle: string;
  mouza: string;
  dagNo: string;
  offeredTotalPrice: number; // BDT
  offeredPricePerDecimal: number; // BDT
  counterOfferByOwner: number; // BDT
  counterPricePerDecimal: number; // BDT
  negotiationStatus: NegotiationStatus;
  meetingDate: string;
  attendedBy: string;
  remarks: string;
  projectId?: string;
}

export interface LegalDocument {
  id: string;
  uuid?: string;
  acquisitionLeadId: string;
  leadTitle: string;
  documentType: string;
  verificationStatus: VerificationStatus;
  documentFileName: string;
  fileSize: string;
  verifiedBy: string;
  verificationDate?: string;
  remarks: string;
  projectId?: string;
}

export interface FollowUpItem {
  id: string;
  uuid?: string;
  sl: number;
  date: string;
  acquisitionLeadId: string;
  landDetails: string;
  ownerDetails: string;
  contact: string;
  followUpType: "Call" | "Site Visit" | "Office Meeting" | "Registry Office" | "Legal Review";
  status: FollowUpStatus;
  note: string;
  assignedTo: string;
  projectId?: string;
}

export interface LamsKpiMetric {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  description: string;
  color: "cyan" | "emerald" | "amber" | "indigo";
}

export interface PipelineStageStat {
  stage: LeadStage;
  count: number;
  areaDecimals: number;
  percentage: number;
}

export interface MouzaDistributionStat {
  mouza: string;
  district: string;
  areaDecimals: number;
  leadsCount: number;
  color: string;
}
