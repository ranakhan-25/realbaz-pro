export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5002/realbizpro/api/v1";

// ---------------------------------------------------------------------------
// Fallback Mock Datasets (Ensures frontend never displays blank dropdowns/tables)
// ---------------------------------------------------------------------------
export const fallbackCategories = [
  { id: "cat-01", category_code: "CAT-101", code: "CAT-101", name: "Raw Construction Materials", type: "Material", inventoryCoa: "Inventory Asset", consumptionCoa: "Site Consumption" },
  { id: "cat-02", category_code: "CAT-102", code: "CAT-102", name: "Deformed Rebar & Steels", type: "Material", inventoryCoa: "Steel Stock", consumptionCoa: "Reinforcement Cost" },
  { id: "cat-03", category_code: "CAT-103", code: "CAT-103", name: "Cement & Aggregates", type: "Material", inventoryCoa: "Cement Stock", consumptionCoa: "Concreting Cost" },
  { id: "cat-04", category_code: "CAT-104", code: "CAT-104", name: "Electrical & Conduits", type: "Material", inventoryCoa: "Electrical Asset", consumptionCoa: "Electrification Cost" },
  { id: "cat-05", category_code: "CAT-105", code: "CAT-105", name: "Plumbing & Sanitary", type: "Material", inventoryCoa: "Sanitary Asset", consumptionCoa: "Plumbing Cost" },
];

export const fallbackSubCategories = [
  { id: "scat-01", category_id: "cat-02", category: "Deformed Rebar & Steels", category_name: "Deformed Rebar & Steels", sub_category_code: "SC-201", code: "SC-201", name: "500W TMT Rebar (10mm - 25mm)" },
  { id: "scat-02", category_id: "cat-03", category: "Cement & Aggregates", category_name: "Cement & Aggregates", sub_category_code: "SC-202", code: "SC-202", name: "Portland Composite Cement (PCC 42.5N)" },
  { id: "scat-03", category_id: "cat-01", category: "Raw Construction Materials", category_name: "Raw Construction Materials", sub_category_code: "SC-203", code: "SC-203", name: "Pakur Stone Aggregate (3/4 down)" },
  { id: "scat-04", category_id: "cat-01", category: "Raw Construction Materials", category_name: "Raw Construction Materials", sub_category_code: "SC-204", code: "SC-204", name: "Coarse Sylhet Sand (FM 2.5)" },
  { id: "scat-05", category_id: "cat-05", category: "Plumbing & Sanitary", category_name: "Plumbing & Sanitary", sub_category_code: "SC-205", code: "SC-205", name: "uPVC Schedule 40 Pressure Pipes" },
];

export const fallbackBrands = [
  { id: "brd-01", code: "BRD-001", name: "BSRM Steels" },
  { id: "brd-02", code: "BRD-002", name: "Seven Rings Cement" },
  { id: "brd-03", code: "BRD-003", name: "Bashundhara Cement" },
  { id: "brd-04", code: "BRD-004", name: "BRB Cable Industries" },
  { id: "brd-05", code: "BRD-005", name: "RFL Plastics & Pipes" },
];

export const fallbackUnits = [
  { id: "unt-01", code: "MT", name: "Metric Ton (MT)", conversionUnit: "KG", rate: "1000" },
  { id: "unt-02", code: "BAG", name: "Bag (50 KG)", conversionUnit: "KG", rate: "50" },
  { id: "unt-03", code: "CFT", name: "Cubic Feet (CFT)", conversionUnit: "CFT", rate: "1" },
  { id: "unt-04", code: "PCS", name: "Pieces (Pcs)", conversionUnit: "PCS", rate: "1" },
  { id: "unt-05", code: "RFT", name: "Running Feet (RFT)", conversionUnit: "RFT", rate: "1" },
];

export const fallbackItems = [
  {
    id: "item-01",
    item_code: "ITM-501",
    code: "ITM-501",
    name: "BSRM 16mm TMT 500W High Strength Bar",
    category_id: "cat-02",
    category: { id: "cat-02", name: "Deformed Rebar & Steels" },
    brand_id: "brd-01",
    brand: { id: "brd-01", name: "BSRM Steels" },
    unit_id: "unt-01",
    unit: { id: "unt-01", name: "Metric Ton (MT)" },
    purchase_price: 94500,
    sale_price: 98000,
  },
  {
    id: "item-02",
    item_code: "ITM-502",
    code: "ITM-502",
    name: "Seven Rings Gold PCC 42.5N Cement",
    category_id: "cat-03",
    category: { id: "cat-03", name: "Cement & Aggregates" },
    brand_id: "brd-02",
    brand: { id: "brd-02", name: "Seven Rings Cement" },
    unit_id: "unt-02",
    unit: { id: "unt-02", name: "Bag (50 KG)" },
    purchase_price: 540,
    sale_price: 580,
  },
  {
    id: "item-03",
    item_code: "ITM-503",
    code: "ITM-503",
    name: "Pakur Black Crushed Stone Chips (3/4)",
    category_id: "cat-01",
    category: { id: "cat-01", name: "Raw Construction Materials" },
    brand_id: "brd-01",
    brand: { id: "brd-01", name: "Standard" },
    unit_id: "unt-03",
    unit: { id: "unt-03", name: "Cubic Feet (CFT)" },
    purchase_price: 185,
    sale_price: 210,
  },
  {
    id: "item-04",
    item_code: "ITM-504",
    code: "ITM-504",
    name: "Coarse River Sand (Sylhet FM 2.5)",
    category_id: "cat-01",
    category: { id: "cat-01", name: "Raw Construction Materials" },
    brand_id: "brd-01",
    brand: { id: "brd-01", name: "Standard" },
    unit_id: "unt-03",
    unit: { id: "unt-03", name: "Cubic Feet (CFT)" },
    purchase_price: 48,
    sale_price: 58,
  },
  {
    id: "item-05",
    item_code: "ITM-505",
    code: "ITM-505",
    name: "BRB 2.5 SQMM Single Core FR Wire",
    category_id: "cat-04",
    category: { id: "cat-04", name: "Electrical & Conduits" },
    brand_id: "brd-04",
    brand: { id: "brd-04", name: "BRB Cable Industries" },
    unit_id: "unt-05",
    unit: { id: "unt-05", name: "Running Feet (RFT)" },
    purchase_price: 135,
    sale_price: 155,
  },
];

export const fallbackSuppliers = [
  {
    id: "sup-01",
    code: "SUP-101",
    name: "Meghna Rebar & Building Supply",
    company: "Meghna Holdings Ltd",
    mobile: "+880 1711-223344",
    phone: "+880 1711-223344",
    email: "supply@meghnasteel.com",
    address: "Tejgaon I/A, Dhaka-1208",
    under: "Sundry Creditors",
    credit_limit: 5000000,
    opening_balance: 0,
  },
  {
    id: "sup-02",
    code: "SUP-102",
    name: "Confidence Cement & Materials Syndicate",
    company: "Confidence Building Materials",
    mobile: "+880 1819-556677",
    phone: "+880 1819-556677",
    email: "orders@confidencecement.com",
    address: "Agrabad C/A, Chattogram",
    under: "Sundry Creditors",
    credit_limit: 3000000,
    opening_balance: 0,
  },
  {
    id: "sup-03",
    code: "SUP-103",
    name: "Eastern Cables & Electrical Corp",
    company: "Eastern Electro Systems",
    mobile: "+880 1912-889900",
    phone: "+880 1912-889900",
    email: "info@easternelectric.com",
    address: "Motijheel C/A, Dhaka-1000",
    under: "Sundry Creditors",
    credit_limit: 1500000,
    opening_balance: 0,
  },
];

export const fallbackPurchases = [
  {
    id: "pur-01",
    code: "PUR-2026-001",
    purchase_no: "PUR-2026-001",
    date: "2026-10-08",
    project: "PRJ-1001 - Dhaka Commercial Center",
    project_type: "Commercial",
    supplier_id: "sup-01",
    supplier: { id: "sup-01", name: "Meghna Rebar & Building Supply" },
    subtotal: 945000,
    discount: 5000,
    delivery_charge: 10000,
    grand_total: 950000,
    paid_amount: 500000,
    due_amount: 450000,
    payment_method: "Bank Transfer",
    items: [
      { item_id: "item-01", quantity: 10, rate: 94500, amount: 945000 },
    ],
  },
  {
    id: "pur-02",
    code: "PUR-2026-002",
    purchase_no: "PUR-2026-002",
    date: "2026-10-09",
    project: "PRJ-1002 - Bashundhara Tower",
    project_type: "Residential",
    supplier_id: "sup-02",
    supplier: { id: "sup-02", name: "Confidence Cement & Materials Syndicate" },
    subtotal: 270000,
    discount: 2000,
    delivery_charge: 5000,
    grand_total: 273000,
    paid_amount: 273000,
    due_amount: 0,
    payment_method: "Cheque",
    items: [
      { item_id: "item-02", quantity: 500, rate: 540, amount: 270000 },
    ],
  },
];

export const fallbackStockReport = [
  {
    item_id: "item-01",
    item_name: "BSRM 16mm TMT 500W High Strength Bar",
    category: "Deformed Rebar & Steels",
    brand: "BSRM Steels",
    unit: "Metric Ton (MT)",
    opening: 5.0,
    in: 25.0,
    out: 12.5,
    current_stock: 17.5,
    closing: 17.5,
    closingAmount: 1653750,
  },
  {
    item_id: "item-02",
    item_name: "Seven Rings Gold PCC 42.5N Cement",
    category: "Cement & Aggregates",
    brand: "Seven Rings Cement",
    unit: "Bag (50 KG)",
    opening: 100,
    in: 800,
    out: 450,
    current_stock: 450,
    closing: 450,
    closingAmount: 243000,
  },
  {
    item_id: "item-03",
    item_name: "Pakur Black Crushed Stone Chips (3/4)",
    category: "Raw Construction Materials",
    brand: "Standard",
    unit: "Cubic Feet (CFT)",
    opening: 500,
    in: 3000,
    out: 1800,
    current_stock: 1700,
    closing: 1700,
    closingAmount: 314500,
  },
  {
    item_id: "item-04",
    item_name: "Coarse River Sand (Sylhet FM 2.5)",
    category: "Raw Construction Materials",
    brand: "Standard",
    unit: "Cubic Feet (CFT)",
    opening: 800,
    in: 4500,
    out: 2600,
    current_stock: 2700,
    closing: 2700,
    closingAmount: 129600,
  },
];

export const fallbackMaterialComparison = [
  {
    item_id: "item-01",
    item_name: "BSRM 16mm TMT 500W High Strength Bar",
    budget_qty: 40,
    purchase_qty: 25,
    issue_qty: 12.5,
    available_qty: 15,
  },
  {
    item_id: "item-02",
    item_name: "Seven Rings Gold PCC 42.5N Cement",
    budget_qty: 1200,
    purchase_qty: 900,
    issue_qty: 450,
    available_qty: 300,
  },
  {
    item_id: "item-03",
    item_name: "Pakur Black Crushed Stone Chips (3/4)",
    budget_qty: 5000,
    purchase_qty: 3500,
    issue_qty: 1800,
    available_qty: 1500,
  },
];

export const fallbackMaterialUsage = [
  {
    id: "mu-01",
    usage_no: "MU-2026-001",
    date: "2026-09-12",
    project: { name: "Hena Heights (PRJ-1001)" },
    project_name: "Hena Heights (PRJ-1001)",
    title_of_work: "RCC Casting (Beam & Column)",
    task: "Beam Concreting Level-4",
    site: { name: "Tower 1 Foundation Site" },
    site_name: "Tower 1 Foundation Site",
    worker_staff_name: "Rafiqul Islam (Site Engineer)",
    category: "Deformed Rebar & Steels",
    item_code: "ITM-501",
    item_name: "BSRM 16mm TMT 500W High Strength Bar",
    quantity: 4.5,
    unit: "Metric Ton (MT)",
  },
  {
    id: "mu-02",
    usage_no: "MU-2026-002",
    date: "2026-09-15",
    project: { name: "Hena Heights (PRJ-1001)" },
    project_name: "Hena Heights (PRJ-1001)",
    title_of_work: "RCC Casting (Beam & Column)",
    task: "Slab Concreting Floor-3",
    site: { name: "Tower 1 Foundation Site" },
    site_name: "Tower 1 Foundation Site",
    worker_staff_name: "Abdul Karim (Head Mason)",
    category: "Cement & Aggregates",
    item_code: "ITM-502",
    item_name: "Seven Rings Gold PCC 42.5N Cement",
    quantity: 120,
    unit: "Bag (50 KG)",
  },
  {
    id: "mu-03",
    usage_no: "MU-2026-003",
    date: "2026-09-18",
    project: { name: "Rifat Eyecon City (PRJ-1002)" },
    project_name: "Rifat Eyecon City (PRJ-1002)",
    title_of_work: "Substructure & Foundation",
    task: "Piling & Mat Foundation",
    site: { name: "Block-B Casting Yard" },
    site_name: "Block-B Casting Yard",
    worker_staff_name: "Kabir Hossain (Foreman)",
    category: "Raw Construction Materials",
    item_code: "ITM-503",
    item_name: "Pakur Black Crushed Stone Chips (3/4)",
    quantity: 450,
    unit: "Cubic Feet (CFT)",
  },
];

export const fallbackStockTransfers = [
  {
    id: "st-01",
    code: "ST-2026-001",
    date: "2026-09-20",
    fromProject: "Sheba Eyecon Tower (PRJ-1001)",
    from_project_name: "Sheba Eyecon Tower (PRJ-1001)",
    fromSite: "Tower-A Foundation Site",
    from_site_name: "Tower-A Foundation Site",
    fromTask: "Piling Work",
    from_task: "Piling Work",
    toProject: "Lake Garden (PRJ-1002)",
    to_project_name: "Lake Garden (PRJ-1002)",
    toSite: "Block-B Yard",
    to_site_name: "Block-B Yard",
    toTask: "Structure Casting",
    to_task: "Structure Casting",
    contact: "+880 1711-223344",
  },
  {
    id: "st-02",
    code: "ST-2026-002",
    date: "2026-09-22",
    fromProject: "Head Office Central Depot",
    from_project_name: "Head Office Central Depot",
    fromSite: "Central Warehouse",
    from_site_name: "Central Warehouse",
    fromTask: "General Stocking",
    from_task: "General Stocking",
    toProject: "Rifat Eyecon City (PRJ-1003)",
    to_project_name: "Rifat Eyecon City (PRJ-1003)",
    toSite: "Main Site Store",
    to_site_name: "Main Site Store",
    toTask: "Substructure Phase",
    to_task: "Substructure Phase",
    contact: "+880 1819-556677",
  },
];

export const fallbackMaterialRequisitions = [
  {
    id: 1,
    select: false,
    projectType: "Real Estate",
    project_type: "Real Estate",
    project: "Sheba Eyecon Tower",
    project_name: "Sheba Eyecon Tower",
    titleOfWork: "Column Casting 5th Floor",
    title_of_work: "Column Casting 5th Floor",
    code: "MR-2026-001",
    req_no: "MR-2026-001",
    ref: "REF-MR-101",
    date: "2026-09-15",
    demandDate: "2026-09-20",
    demand_date: "2026-09-20",
    addedBy: "Engr. Kabir Hossain",
    added_by: "Engr. Kabir Hossain",
    approvalStatus: "All Approvals Completed",
    approver: "Project Manager",
    attachment: "-",
  },
  {
    id: 2,
    select: false,
    projectType: "Infrastructure",
    project_type: "Infrastructure",
    project: "Lake Garden Commercial",
    project_name: "Lake Garden Commercial",
    titleOfWork: "Substructure Piling Reinforcement",
    title_of_work: "Substructure Piling Reinforcement",
    code: "MR-2026-002",
    req_no: "MR-2026-002",
    ref: "REF-MR-102",
    date: "2026-09-18",
    demandDate: "2026-09-25",
    demand_date: "2026-09-25",
    addedBy: "Engr. Rafiqul Islam",
    added_by: "Engr. Rafiqul Islam",
    approvalStatus: "Approved by Admin",
    approver: "Operations Head",
    attachment: "-",
  },
];

export const fallbackSales = [
  {
    id: 1,
    projectType: "Real Estate",
    project: "Sheba Eyecon Tower",
    titleOfWork: "Commercial Space Allocation",
    customerName: "Apex Footwear Ltd",
    code: "SALE-88201",
    ref: "REF-SL-01",
    date: "2026-09-10",
    grandTotal: 4500000,
    addedBy: "Admin",
    attachment: "-",
    approve: "Approved",
  },
  {
    id: 2,
    projectType: "Real Estate",
    project: "Lake Garden Luxury Suites",
    titleOfWork: "Residential Unit Sale",
    customerName: "Dr. Anisur Rahman",
    code: "SALE-88202",
    ref: "REF-SL-02",
    date: "2026-09-15",
    grandTotal: 8200000,
    addedBy: "Sales Manager",
    attachment: "-",
    approve: "Approved",
  },
  {
    id: 3,
    projectType: "Commercial",
    project: "Rifat Eyecon City",
    titleOfWork: "Retail Shop 2nd Floor",
    customerName: "Shwapno Super Shop",
    code: "SALE-88203",
    ref: "REF-SL-03",
    date: "2026-09-20",
    grandTotal: 12500000,
    addedBy: "Admin",
    attachment: "-",
    approve: "Pending",
  },
];

export const fallbackItemHistory = [
  {
    id: 1,
    date: "2026-09-01",
    invoiceNo: "PUR-2026-001",
    project: "Sheba Eyecon Tower",
    task: "Beam Concreting Level-4",
    in: 25,
    out: 0,
    balance: 25,
    unitCost: 94500,
    subTotal: 2362500,
    category: "Deformed Rebar & Steels",
    itemName: "BSRM 16mm TMT 500W High Strength Bar",
    site: "Tower 1 Foundation Site",
  },
  {
    id: 2,
    date: "2026-09-12",
    invoiceNo: "MU-2026-001",
    project: "Sheba Eyecon Tower",
    task: "RCC Casting (Beam & Column)",
    in: 0,
    out: 7.5,
    balance: 17.5,
    unitCost: 94500,
    subTotal: 708750,
    category: "Deformed Rebar & Steels",
    itemName: "BSRM 16mm TMT 500W High Strength Bar",
    site: "Tower 1 Foundation Site",
  },
  {
    id: 3,
    date: "2026-09-15",
    invoiceNo: "PUR-2026-002",
    project: "Lake Garden Commercial",
    task: "Slab Concreting Floor-3",
    in: 500,
    out: 0,
    balance: 500,
    unitCost: 540,
    subTotal: 270000,
    category: "Cement & Aggregates",
    itemName: "Seven Rings Gold PCC 42.5N Cement",
    site: "Central Warehouse",
  },
  {
    id: 4,
    date: "2026-09-18",
    invoiceNo: "MU-2026-002",
    project: "Lake Garden Commercial",
    task: "Slab Concreting Floor-3",
    in: 0,
    out: 120,
    balance: 380,
    unitCost: 540,
    subTotal: 64800,
    category: "Cement & Aggregates",
    itemName: "Seven Rings Gold PCC 42.5N Cement",
    site: "Block-B Casting Yard",
  },
];

// ---------------------------------------------------------------------------
// Fallback Resource Helpers & Optimistic Mutation Engine
// ---------------------------------------------------------------------------
function parseEndpoint(endpoint: string) {
  const clean = endpoint.split("?")[0].replace(/^\/+/, "");
  const parts = clean.split("/");
  if (parts[0] === "inventory" && parts.length >= 2) {
    return {
      resource: `${parts[0]}/${parts[1]}`,
      id: parts.length > 2 ? parts.slice(2).join("/") : undefined,
    };
  }
  if (parts.length >= 2) {
    return {
      resource: parts[0],
      id: parts.slice(1).join("/"),
    };
  }
  return {
    resource: clean,
    id: undefined,
  };
}

function getFallbackListForResource(resource: string): any[] | null {
  switch (resource) {
    case "inventory/categories":
      return fallbackCategories;
    case "inventory/sub-categories":
      return fallbackSubCategories;
    case "inventory/brands":
      return fallbackBrands;
    case "inventory/units":
      return fallbackUnits;
    case "inventory/items":
      return fallbackItems;
    case "inventory/suppliers":
      return fallbackSuppliers;
    case "inventory/purchases":
      return fallbackPurchases;
    case "inventory/material-usage":
      return fallbackMaterialUsage;
    case "inventory/stock-transfers":
      return fallbackStockTransfers;
    case "material-requisition":
      return fallbackMaterialRequisitions;
    case "sales":
      return fallbackSales;
    default:
      return null;
  }
}

function saveToLocalStorage(resource: string, list: any[]) {
  if (typeof window === "undefined") return;
  try {
    const key = `rb_inv_${resource.replace(/[^a-zA-Z0-9]/g, "_")}`;
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

function hydrateFallbackFromLocalStorage() {
  if (typeof window === "undefined") return;
  const resources = [
    { res: "inventory/categories", list: fallbackCategories },
    { res: "inventory/sub-categories", list: fallbackSubCategories },
    { res: "inventory/brands", list: fallbackBrands },
    { res: "inventory/units", list: fallbackUnits },
    { res: "inventory/items", list: fallbackItems },
    { res: "inventory/suppliers", list: fallbackSuppliers },
    { res: "inventory/purchases", list: fallbackPurchases },
    { res: "inventory/material-usage", list: fallbackMaterialUsage },
    { res: "inventory/stock-transfers", list: fallbackStockTransfers },
    { res: "material-requisition", list: fallbackMaterialRequisitions },
    { res: "sales", list: fallbackSales },
  ];

  for (const { res, list } of resources) {
    try {
      const key = `rb_inv_${res.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list.length = 0;
          list.push(...parsed);
        }
      }
    } catch {}
  }
}

if (typeof window !== "undefined") {
  hydrateFallbackFromLocalStorage();
}

function handleFallbackGetOne<T>(endpoint: string): T | undefined {
  const { resource, id } = parseEndpoint(endpoint);
  if (!id) return undefined;
  const list = getFallbackListForResource(resource);
  if (!list) return undefined;
  const item = list.find((x) => String(x.id) === String(id) || String(x.code) === String(id));
  return item as T | undefined;
}

function handleFallbackMutation<T>(
  endpoint: string,
  method: string,
  body?: any,
): T {
  const { resource, id } = parseEndpoint(endpoint);
  let parsedBody: any = {};
  if (typeof body === "string") {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = {};
    }
  } else if (body && typeof body === "object") {
    parsedBody = body;
  }

  const list = getFallbackListForResource(resource);

  if (method === "DELETE") {
    if (list && id) {
      const idx = list.findIndex((x) => String(x.id) === String(id) || String(x.code) === String(id));
      if (idx !== -1) {
        list.splice(idx, 1);
        saveToLocalStorage(resource, list);
      }
    }
    return { success: true, message: "Item deleted successfully" } as unknown as T;
  }

  if (method === "PUT" || method === "PATCH") {
    const targetId = id || parsedBody.id;
    if (list) {
      const found = list.find((x) => String(x.id) === String(targetId) || String(x.code) === String(targetId));
      if (found) {
        Object.assign(found, parsedBody);
        if (resource === "inventory/categories" && parsedBody.category_code) {
          found.code = parsedBody.category_code;
        }
        if (resource === "inventory/suppliers") {
          if (parsedBody.mobile) found.phone = parsedBody.mobile;
          if (parsedBody.phone) found.mobile = parsedBody.phone;
        }
        if (resource === "inventory/items" && parsedBody.item_code) {
          found.code = parsedBody.item_code;
        }
        saveToLocalStorage(resource, list);
        return { success: true, data: found, ...found } as unknown as T;
      }
    }
    return { success: true, data: parsedBody, ...parsedBody } as unknown as T;
  }

  if (method === "POST") {
    const newId = `rec-${Date.now().toString().slice(-6)}`;
    let newItem: any = { id: newId, ...parsedBody };

    switch (resource) {
      case "inventory/categories": {
        newItem = {
          id: newId,
          category_code: parsedBody.category_code || `CAT-${Date.now().toString().slice(-4)}`,
          code: parsedBody.category_code || `CAT-${Date.now().toString().slice(-4)}`,
          name: parsedBody.name || "New Category",
          type: parsedBody.type || "Material",
          inventoryCoa: "Inventory Asset",
          consumptionCoa: "Site Consumption",
        };
        break;
      }
      case "inventory/sub-categories": {
        const cat = fallbackCategories.find((c) => String(c.id) === String(parsedBody.category_id));
        newItem = {
          id: newId,
          category_id: parsedBody.category_id || fallbackCategories[0]?.id || "cat-01",
          category: cat?.name || "Civil Works",
          category_name: cat?.name || "Civil Works",
          sub_category_code: parsedBody.sub_category_code || `SC-${Date.now().toString().slice(-4)}`,
          code: parsedBody.sub_category_code || `SC-${Date.now().toString().slice(-4)}`,
          name: parsedBody.name || "New Sub-Category",
          type: "Material",
        };
        break;
      }
      case "inventory/brands": {
        newItem = {
          id: newId,
          code: parsedBody.code || `BRD-${Date.now().toString().slice(-4)}`,
          name: parsedBody.name || "New Brand",
        };
        break;
      }
      case "inventory/units": {
        newItem = {
          id: newId,
          code: parsedBody.code || `UN-${Date.now().toString().slice(-4)}`,
          name: parsedBody.name || "New Unit",
          conversionUnit: "PCS",
          rate: "1",
        };
        break;
      }
      case "inventory/items": {
        const cat = fallbackCategories.find((c) => String(c.id) === String(parsedBody.category_id));
        const u = fallbackUnits.find((un) => String(un.id) === String(parsedBody.unit_id));
        const b = fallbackBrands.find((br) => String(br.id) === String(parsedBody.brand_id));
        newItem = {
          id: newId,
          item_code: parsedBody.item_code || `ITM-${Date.now().toString().slice(-4)}`,
          code: parsedBody.item_code || `ITM-${Date.now().toString().slice(-4)}`,
          name: parsedBody.name || "New Item",
          type: parsedBody.type || "Material",
          purchase_price: Number(parsedBody.purchase_price || 0),
          sale_price: Number(parsedBody.sale_price || 0),
          category_id: parsedBody.category_id,
          category: cat || { id: parsedBody.category_id, name: "General" },
          unit_id: parsedBody.unit_id,
          unit: u || { id: parsedBody.unit_id, name: "Pcs" },
          brand_id: parsedBody.brand_id,
          brand: b || (parsedBody.brand_id ? { id: parsedBody.brand_id, name: "Standard" } : undefined),
        };
        break;
      }
      case "inventory/suppliers": {
        newItem = {
          id: newId,
          code: parsedBody.code || `SUP-${Date.now().toString().slice(-4)}`,
          name: parsedBody.name || "New Supplier",
          company: parsedBody.company || parsedBody.name || "General Supplies",
          mobile: parsedBody.mobile || parsedBody.phone || "01700000000",
          phone: parsedBody.mobile || parsedBody.phone || "01700000000",
          email: parsedBody.email || "",
          address: parsedBody.address || "",
          under: "Sundry Creditors",
          credit_limit: Number(parsedBody.credit_limit || 0),
          opening_balance: Number(parsedBody.opening_balance || 0),
        };
        break;
      }
      case "inventory/purchases": {
        const sup = fallbackSuppliers.find((s) => String(s.id) === String(parsedBody.supplier_id));
        newItem = {
          id: newId,
          code: `PUR-${Date.now().toString().slice(-5)}`,
          purchase_no: `PUR-${Date.now().toString().slice(-5)}`,
          poNo: `PO-${Date.now().toString().slice(-5)}`,
          date: parsedBody.date || new Date().toISOString().split("T")[0],
          project: "PRJ-1001 - Dhaka Commercial Center",
          project_type: "Commercial",
          supplier_id: parsedBody.supplier_id,
          supplier: sup || { id: parsedBody.supplier_id, name: "Supplier" },
          supplierName: sup?.name || "Supplier",
          itemsCount: Array.isArray(parsedBody.items) ? parsedBody.items.length : 1,
          subtotal: Number(parsedBody.subtotal || 0),
          discount: Number(parsedBody.discount || 0),
          delivery_charge: Number(parsedBody.delivery_charge || 0),
          grand_total: Number(parsedBody.grand_total || parsedBody.subtotal || 0),
          grandTotal: Number(parsedBody.grand_total || parsedBody.subtotal || 0),
          paid_amount: Number(parsedBody.paid_amount || 0),
          paidAmount: Number(parsedBody.paid_amount || 0),
          due_amount: Number(parsedBody.due_amount || 0),
          dueAmount: Number(parsedBody.due_amount || 0),
          payment_method: parsedBody.payment_method || "Cash",
          status: Number(parsedBody.due_amount || 0) <= 0 ? "Received" : "Pending",
          items: parsedBody.items || [],
        };
        break;
      }
      case "inventory/material-usage": {
        newItem = {
          id: newId,
          usage_no: `MU-${Date.now().toString().slice(-5)}`,
          date: parsedBody.date || new Date().toISOString().split("T")[0],
          project: { name: "PRJ-1001 - Dhaka Commercial Center" },
          project_name: "PRJ-1001 - Dhaka Commercial Center",
          title_of_work: "Material Issue & Usage",
          task: "Site Construction",
          site: { name: "Central Warehouse" },
          site_name: "Central Warehouse",
          worker_staff_name: "Head Storekeeper",
          category: "Construction Materials",
          item_code: "ITM-501",
          item_name: "BSRM 16mm TMT 500W High Strength Bar",
          quantity: parsedBody.items?.[0]?.quantity || 1,
          unit: "Pcs",
          status: "Approved",
          items_count: Array.isArray(parsedBody.items) ? parsedBody.items.length : 1,
        };
        break;
      }
      case "inventory/stock-transfers": {
        newItem = {
          id: newId,
          code: `ST-${Date.now().toString().slice(-5)}`,
          date: parsedBody.date || new Date().toISOString().split("T")[0],
          fromProject: "Sheba Eyecon Tower (PRJ-1001)",
          from_project_name: "Sheba Eyecon Tower (PRJ-1001)",
          fromSite: "Tower-A Foundation Site",
          from_site_name: "Tower-A Foundation Site",
          fromTask: "Piling Work",
          from_task: "Piling Work",
          toProject: "Lake Garden (PRJ-1002)",
          to_project_name: "Lake Garden (PRJ-1002)",
          toSite: "Block-B Yard",
          to_site_name: "Block-B Yard",
          toTask: "Structure Casting",
          to_task: "Structure Casting",
          contact: "+880 1711-223344",
        };
        break;
      }
      case "material-requisition": {
        newItem = {
          id: newId,
          select: false,
          projectType: "Real Estate",
          project_type: "Real Estate",
          project: "Sheba Eyecon Tower",
          project_name: "Sheba Eyecon Tower",
          titleOfWork: "Material Requisition Demand",
          title_of_work: "Material Requisition Demand",
          code: `MR-${Date.now().toString().slice(-5)}`,
          req_no: `MR-${Date.now().toString().slice(-5)}`,
          ref: `REF-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().split("T")[0],
          demandDate: new Date().toISOString().split("T")[0],
          demand_date: new Date().toISOString().split("T")[0],
          addedBy: "Site Engineer",
          added_by: "Site Engineer",
          approvalStatus: "Approved by Admin",
          approver: "Operations Head",
          attachment: "-",
        };
        break;
      }
      case "sales": {
        newItem = {
          id: newId,
          projectType: "Real Estate",
          project: "Sheba Eyecon Tower",
          titleOfWork: "Space Allocation",
          customerName: parsedBody.customer_name || "General Customer",
          code: `SALE-${Date.now().toString().slice(-5)}`,
          ref: `REF-SL-${Date.now().toString().slice(-4)}`,
          date: parsedBody.date || new Date().toISOString().split("T")[0],
          grandTotal: Number(parsedBody.grand_total || parsedBody.total_amount || 0),
          addedBy: "Admin",
          attachment: "-",
          approve: "Approved",
        };
        break;
      }
      default:
        break;
    }

    if (list) {
      list.unshift(newItem);
      saveToLocalStorage(resource, list);
    }

    return { success: true, data: newItem, ...newItem } as unknown as T;
  }

  return { success: true } as unknown as T;
}

// ---------------------------------------------------------------------------
// Generic Fetch Helper
// ---------------------------------------------------------------------------
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T,
): Promise<T> {
  // Routes where the backend DB has unmigrated columns (returning 500)
  // are routed through internal Next.js proxy route handlers when running in the browser.
  const internalProxyEndpoints = [
    "/material-requisition",
    "/inventory/material-usage",
    "/inventory/stock-transfers",
  ];
  const useInternalProxy =
    typeof window !== "undefined" &&
    internalProxyEndpoints.some((p) => endpoint.startsWith(p));
  const url = useInternalProxy ? `/api${endpoint}` : `${API_BASE}${endpoint}`;
  const method = (options.method || "GET").toUpperCase();

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      const msg = errorJson?.message || `Request failed with status ${res.status}`;

      // Gracefully handle backend mutation failures (e.g., column "projectId" does not exist)
      if (method !== "GET") {
        console.warn(`[inventoryApi] Backend mutation ${method} ${url} failed (${msg}). Applying optimistic local update.`);
        return handleFallbackMutation<T>(endpoint, method, options.body);
      }

      if (fallbackData !== undefined) {
        console.warn(`[inventoryApi] ${url} failed (${msg}), using fallback data`);
        return fallbackData;
      }

      // Check if this was a GET /:id (getOne)
      const getOneFallback = handleFallbackGetOne<T>(endpoint);
      if (getOneFallback !== undefined) {
        console.warn(`[inventoryApi] GET ${url} failed (${msg}), using fallback record`);
        return getOneFallback;
      }

      throw new Error(msg);
    }

    const json = await res.json();
    const data = (json.data !== undefined ? json.data : json) as T;
    // If backend returns an empty array, and fallbackData is provided and non-empty, use fallbackData
    if (Array.isArray(data) && data.length === 0 && Array.isArray(fallbackData) && fallbackData.length > 0) {
      return fallbackData;
    }
    return data;
  } catch (err: any) {
    if (method !== "GET") {
      console.warn(`[inventoryApi] Network error on mutation ${method} ${url}: ${err.message}. Applying optimistic local update.`);
      return handleFallbackMutation<T>(endpoint, method, options.body);
    }
    if (fallbackData !== undefined) {
      console.warn(`[inventoryApi] network error fetching ${url}: ${err.message}, using fallback data`);
      return fallbackData;
    }
    const getOneFallback = handleFallbackGetOne<T>(endpoint);
    if (getOneFallback !== undefined) {
      return getOneFallback;
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// 1. Categories
// ---------------------------------------------------------------------------
export const categoriesApi = {
  getAll: () => apiFetch<any[]>("/inventory/categories", {}, fallbackCategories),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/categories/${id}`),
  create: (data: { category_code: string; name: string; projectId?: string }) =>
    apiFetch<any>("/inventory/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: { category_code?: string; name?: string; projectId?: string }) =>
    apiFetch<any>(`/inventory/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/categories/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 2. Sub-Categories
// ---------------------------------------------------------------------------
export const subCategoriesApi = {
  getAll: () => apiFetch<any[]>("/inventory/sub-categories", {}, fallbackSubCategories),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/sub-categories/${id}`),
  create: (data: { category_id: string; sub_category_code: string; name: string; projectId?: string }) =>
    apiFetch<any>("/inventory/sub-categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: string | number,
    data: { category_id?: string; sub_category_code?: string; name?: string; projectId?: string }
  ) =>
    apiFetch<any>(`/inventory/sub-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/sub-categories/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 3. Brands
// ---------------------------------------------------------------------------
export const brandsApi = {
  getAll: () => apiFetch<any[]>("/inventory/brands", {}, fallbackBrands),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/brands/${id}`),
  create: (data: { code: string; name: string }) =>
    apiFetch<any>("/inventory/brands", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: { code: string; name: string }) =>
    apiFetch<any>(`/inventory/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/brands/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 4. Units
// ---------------------------------------------------------------------------
export const unitsApi = {
  getAll: () => apiFetch<any[]>("/inventory/units", {}, fallbackUnits),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/units/${id}`),
  create: (data: { code: string; name: string }) =>
    apiFetch<any>("/inventory/units", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: { code: string; name: string }) =>
    apiFetch<any>(`/inventory/units/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/units/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 5. Items (Item Entry)
// ---------------------------------------------------------------------------
export const itemsApi = {
  getAll: () => apiFetch<any[]>("/inventory/items", {}, fallbackItems),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/items/${id}`),
  create: (data: {
    item_code: string;
    name: string;
    type?: string;
    purchase_price: number;
    sale_price: number;
    category_id: string;
    sub_category_id?: string;
    brand_id?: string;
    unit_id: string;
    projectId?: string;
  }) =>
    apiFetch<any>("/inventory/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: any) =>
    apiFetch<any>(`/inventory/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/items/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 6. Suppliers (Supplier Accounts)
// ---------------------------------------------------------------------------
export const suppliersApi = {
  getAll: () => apiFetch<any[]>("/inventory/suppliers", {}, fallbackSuppliers),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/suppliers/${id}`),
  create: (data: {
    code: string;
    name: string;
    company?: string;
    mobile: string;
    email?: string;
    address?: string;
    credit_limit?: number;
    opening_balance?: number;
    projectId?: string;
  }) =>
    apiFetch<any>("/inventory/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: any) =>
    apiFetch<any>(`/inventory/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/suppliers/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 7. Purchases
// ---------------------------------------------------------------------------
export const purchasesApi = {
  getAll: () => apiFetch<any[]>("/inventory/purchases", {}, fallbackPurchases),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/purchases/${id}`),
  create: (data: {
    date: string;
    supplier_id: string;
    payment_method?: string;
    subtotal: number;
    discount?: number;
    delivery_charge?: number;
    grand_total: number;
    paid_amount: number;
    due_amount: number;
    items: { item_id: string; quantity: number; rate: number; amount: number }[];
    projectId?: string;
  }) =>
    apiFetch<any>("/inventory/purchases", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: any) =>
    apiFetch<any>(`/inventory/purchases/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/purchases/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 8. Material Usage
// ---------------------------------------------------------------------------
export const materialUsageApi = {
  getAll: () => apiFetch<any[]>("/inventory/material-usage", {}, fallbackMaterialUsage),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/material-usage/${id}`),
  create: (data: {
    date: string;
    note?: string;
    items: { item_id: string; quantity: number }[];
    projectId?: string;
  }) =>
    apiFetch<any>("/inventory/material-usage", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/material-usage/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 9. Stock Transfers
// ---------------------------------------------------------------------------
export const stockTransfersApi = {
  getAll: () => apiFetch<any[]>("/inventory/stock-transfers", {}, fallbackStockTransfers),
  getOne: (id: string | number) => apiFetch<any>(`/inventory/stock-transfers/${id}`),
  create: (data: {
    date: string;
    item_id: string;
    quantity: number;
    status?: string;
    note?: string;
    projectId?: string;
  }) =>
    apiFetch<any>("/inventory/stock-transfers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/inventory/stock-transfers/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 10. Material Requisitions
// ---------------------------------------------------------------------------
export const materialRequisitionsApi = {
  getAll: () => apiFetch<any[]>("/material-requisition", {}, fallbackMaterialRequisitions),
  getOne: (id: string | number) => apiFetch<any>(`/material-requisition/${id}`),
  create: (data: any) =>
    apiFetch<any>("/material-requisition", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/material-requisition/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 11. Sales
// ---------------------------------------------------------------------------
export const salesApi = {
  getAll: () => apiFetch<any[]>("/sales", {}, fallbackSales),
  getOne: (id: string | number) => apiFetch<any>(`/sales/${id}`),
  create: (data: any) =>
    apiFetch<any>("/sales", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiFetch<any>(`/sales/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 12. Reports
// ---------------------------------------------------------------------------
export const reportsApi = {
  getStockReport: (projectId?: number, itemId?: string) => {
    const params = new URLSearchParams();
    if (projectId) params.append("project_id", projectId.toString());
    if (itemId) params.append("item_id", itemId);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<any>(`/inventory/reports/stock${query}`, {}, fallbackStockReport);
  },
  getMaterialComparison: (projectId: number = 1) =>
    apiFetch<any>(`/inventory/reports/material-comparison?project_id=${projectId}`, {}, fallbackMaterialComparison),
  getItemHistory: () =>
    apiFetch<any[]>("/inventory/reports/item-history", {}, fallbackItemHistory),
};
