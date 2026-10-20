/* eslint-disable prettier/prettier */
/**
 * Sidebar menu structures for every module / role.
 * Trees are authored as indented text (2 spaces per level) and parsed once.
 */

export type MenuNode = {
  label: string;
  slug: string;
  path: string; // full path from module root, e.g. "projects/report/project-summary"
  children?: MenuNode[];
};

export type ModuleKey =
   "lams" | "inventory" | "accounts" | "hrm" | "crm" | "cr" |  "project" | "csm"| "procurement" | "all";

export const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "lams", label: "LAMS" },
  { key: "project", label: "Project" },
  { key: "csm", label: "CSM" },
  { key: "inventory", label: "Inventory" },
  { key: "accounts", label: "Accounts" },
  { key: "hrm", label: "HRM" },
  { key: "crm", label: "CRM" },
  { key: "cr", label: "Credit Realisation (CR)" },
  { key: "procurement", label: "Procurement" },
  { key: "all", label: "All" },
];

const ACRONYMS: Record<string, string> = {
  boq: "BOQ",
  kpi: "KPI",
  rfq: "RFQ",
  grn: "GRN",
  hrm: "HRM",
  crm: "CRM",
  zkteco: "ZKTeco",
  cr: "CR",
  lams: "LAMS",
  vs: "vs",
  and: "&",
};

export function slugToLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => ACRONYMS[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseTree(text: string): MenuNode[] {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const root: MenuNode[] = [];
  const stack: { depth: number; node: MenuNode }[] = [];

  for (const raw of lines) {
    const depth = (raw.match(/^ */)?.[0].length ?? 0) / 2;
    const slug = raw.trim();
    while (stack.length && (stack[stack.length - 1]?.depth ?? -1) >= depth) stack.pop();
    const parent = stack[stack.length - 1]?.node;
    const path = parent ? `${parent.path}/${slug}` : slug;
    const node: MenuNode = { label: slugToLabel(slug), slug, path };
    if (parent) (parent.children ??= []).push(node);
    else root.push(node);
    stack.push({ depth, node });
  }
  return root;
}

// const project = `
// dashboard
// projects
//   project-type
//   project
//   site
//   report

//     project-details 
//     at_a_glance_project_summary_report
//     project-summary-report
//     project-financial-report
//     project-progress-report 
//     project-wise-income-statement
//     site-wise-income-statement
// contract
//   customer-accounts
//   supplier-accounts
//   labour-work-bank
//   contractor
// investments
//   investor
//   configuration
// share-project
//   assign-share
//   share-report
//   share-collection-report
//   penalty-report
//   share-holders-point-report
//   project-share-configuration
// requisition
//   material-requisition
//   service-work-requisition
//   fund-requisition
//   fund-requisition-report
// billing
//   configuration
//     category
//     sub-category
//     bill-item
//     service-work-name
//     boq-title
//   bill-invoice
//   contractor-bill
//   labour-work-bill
//   work-order
//   contractor-work-order
//   period-billing
//   adjustment-billing
//   quote
//   labour-work-bill-report
// flat-land
//   flat
//   land
//     road
//     block
//     land-details
//   booking
//   sale-offer
//   flat-land-sale
//   flat-land-sale-report
//   sale-collection-report
//   plot-distribution-report
//   aging-report
//   installment-report
// document
// `; 

// const project = `
// dashboard
// projects
//   project-master
//   project-type
//   project-site
//   building
//   floor
//   unit-plot
//   project-party
//   project-agreement
//   project-milestone
//   project-task
//   project-budget
//   project-cost
//   project-progress
//   project-document
//   project-control
//   project-dashboard
// `;
const lams = `
land-lead-management
landowner-management
land-information-and-records
land-valuation
land-legal-verification
land-due-diligence
land-negotiation
acquisition-workflow
acquisition-approval
landowner-settlement
acquisition-documents
acquisition-status-and-reports
`;


const project = `
dashboard
projects
  project-master
  project-type
  project-site
  building
  floor
  unit-plot
  project-party
  project-agreement
  project-milestone
  project-task
  project-budget
  project-cost
  project-progress
  project-document
  project-control
 
`; 


const csm = `  
  dashboard
  work-packages
  boq
  boq-sections-and-items
  boq-revisions
  daily-site-reports
  work-progress
  progress-measurement
  certified-quantity
  contractor-management
  subcontractor-management
  labour-management
  material-consumption

  quality-inspection
  safety-inspection
  site-issues
  delay-tracking
 
`; // site-documents 
    //  site-equipment


const inventory = `
contracts
  supplier-accounts
products
  categories
  sub-categories
  brands
  units
  item-entry
purchase
  add-purchase
  purchase-list
sales
adjustment
  material-usage
  stock-transfer
material-requisition
reports
  purchase-details
  purchase-order-receive-details
  stock-report
  item-history-report
  item-wise-supplier-ledger
  material-usage-report
  material-comparison-report
`;

const billingBlock = `
billing
  configuration
    category
    sub-category
    bill-item
    service-work-name
    boq-title
  bill-invoice
  contractor-bill
  labour-work-bill
  work-order
  contractor-work-order
  period-billing
  adjustment-billing
  quote
  labour-worker-bill-report
flat-land
  flat
  land
    road
    block
    land-details
  booking
  sale-offer
  flat-land-sale
  flat-land-sale-report
  sale-collection-report
  plot-distribution-report
  aging-report
  installment-report
`;

const accounts = `
dashboard

contract
  customer-account
  supplier-account
  labour-worker-contractor
employee
  department
  designation
  shift
  section
  unit
  employee-list
  employee-hierarchy
configuration
  chart-of-group
  chart-of-accounts
voucher
  expense
  receipt-voucher
  payment-voucher
  journal-voucher
  contra-voucher
bank-reconciliation
  bank-reconciliation-statement
  list-of-cheque-range
  list-of-cheque
${billingBlock}
assets
  asset-list
  item-empty
reports
  payable-report
  expense-report
  receipt-report
  receivable-report
  day-book
  receive-payment-statement
  receive-and-payment-summary
  cash-bank-books
  general-ledger
  income_statement
  cash-flow-statement
  fund-flow-summary
  trial_balance_summary
  balance_sheet_summary
  profit-loss-comprehensive-income
  statement-of-financial-position
  statement-of-changes-equity
  property-plant-equipment
  budget-vs-actual-expenses-vs-collection-report
`;

const hrm = `
dashboard
employee
  department
  designation
  shift
  shift-allocation
  bonus
  bonus-generate
  section
  unit
  employee-list
  employee-hierarchy
  Increment 
  ID-Card-Generate
configuration
  month-configuration
  deduction-rules
  allowance-deduction
  salary-grade
  leave-type
  holiday
attendance
  zkteco-device-configuration
  attendance-log
  pending-attendance
  attendance-reconciliations
pay-slip
  pay-slip-process
  pay-slip-details
  bank-pay-slip
leave-application
reports
  daily-attendance-report
  daily-manpower-report
  attendance-register
  attendance-summary
  attendance-details-report
  job-card
  leave-report
  leave-details-report
  salary-sheet
  salary-due-report
  deduction-report
kpi
  employee-call-report
  employee-task-report
  employee-kpi-setting
  reports
`;

const cr = `
dashboard
receipt-voucher
overdue-list
reports
  realization-summary-report
  sale-collection-report
  aging-report
  installment-report
`;



const crm = `
dashboard
configuration
  communication-status
  teams
  lead-category
  campaign
  profession
  lead-source
  offers
  area
  lead-stage
  project
  price-range
lead
  lead-list
  junk-lead
  transfer-history
call-center
  follow-up
  call-report
  call-report-details
  call-assign-history
task-visit
  task-visit-list
  deal-negotiation-activity
  task-visit-summary-report
  task-visit-details-report
property
  flat
  land
  booking
  sale-offer
reports
  user-wise-report
  user-active-report
  sales-pipeline-funnel-report
  team-reports
  interested-flat-land-requirements
  sales-probability
  flat-land-sale-report
  missed-followup-visit-summary
  deal-negotiation-reports
kpi
  employee-kpi-setting
  reports
`;

const procurement = `
dashboard
requisition
  material-requisition
  asset-requisition
rfq
  request-for-quotation
  asset-request-for-quotation
purchase-order
  purchase-order-list
  asset-purchase-order-list
grn
  goods-receipt-note
  asset-goods-receipt-note
purchase-bill
  purchase-bill-invoice
  asset-purchase-bill-invoice
reports
  grn-vs-invoice-report
`;

const all = `
project
  project-type
  project
  agreement
  party-list
  site
  flat-land
  share-project
  reports
inventory
  products
    category
    brand
    unit
    item-entry
  add-purchase
  purchase-list
    material-usage
    stock-transfer
  purchase-order-list
  adjustment
  sales
  reports
    purchase-details
    purchase-order-receive-details
    stock-report
    material-usage-report
requisition
  material-requisition
  service-work-requested-requisition
  fund-requisition
  reports
    fund-requisition-report
accounts
  dashboard
  configuration
    chart-of-group
    chart-of-accounts
  contact
    customer-account
    supplier-accounts
    investors
  billing
    configuration
      category
      bill-item
      service
      boq-title
    bill-invoice
    contractor-bill
    labor-worker-bill
    work-orders
    contractor-work-order
    period-billing
    adjustment-billing
    quote
  assets
    assets-list
  vouchers
    expense
    receipt-voucher
    payment-vouchers
    journal-voucher
    contra-voucher
  bank-reconciliation
  reports
    payable-report
    expense-report
    receive-payment-statement
    cash-bank-books
    general-ledger
    income-statement
    cash-flow-statement
    trial-balance
    balance-sheet
hrm
  dashboard
  employee
    department
    designation
    shift
    section
    unit
    employee
    increment
  deduction-rules
  allowance-deduction
  salary-grade
  attendance-log
  attendance
  pay-slip
  bonus
  bonus-generate
  leave-type
  leave-application
  reports
    daily-attendance-report
    attendance-register
    job-card
    leave-reports
    salary-sheet
    salary-due-report
crm
  dashboard
  configuration
    common-communication-status
    lead-category
    campaign
    profession
    lead-source
    offers
    area
    lead-stage
  lead
  call-center
    follow-up
    transfer
    call-report
  visits
    visits-entry
    visits-report
  reports
    user-wise-report
`;

export const MENUS: Record<ModuleKey, MenuNode[]> = {
  project: parseTree(project),
  csm:parseTree(csm),
  inventory: parseTree(inventory),
  accounts: parseTree(accounts),
  hrm: parseTree(hrm),
  crm: parseTree(crm),
  cr: parseTree(cr),
  lams: parseTree(lams),
  procurement: parseTree(procurement),
  all: parseTree(all),
};

export function isModuleKey(v: string): v is ModuleKey {
  return MODULES.some((m) => m.key === v);
}

export function moduleLabel(key: ModuleKey) {
  return MODULES.find((m) => m.key === key)?.label ?? key;
}

/** Find a node by its path within a module. */
export function findNode(module: ModuleKey, path: string): MenuNode | undefined {
  const walk = (nodes: MenuNode[]): MenuNode | undefined => {
    for (const n of nodes) {
      if (n.path === path) return n;
      const hit = n.children && walk(n.children);
      if (hit) return hit;
    }
    return undefined;
  };
  return walk(MENUS[module]);
}
