import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5002/realbizpro/api/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "This Month";

  try {
    // Attempt to fetch live items count and stock report if backend is available
    let totalItems = 120;
    let totalStockValue = 3500000;
    try {
      const itemsRes = await fetch(`${API_BASE}/inventory/items`, { next: { revalidate: 30 } });
      if (itemsRes.ok) {
        const json = await itemsRes.json();
        const list = json.data || json;
        if (Array.isArray(list)) {
          totalItems = list.length;
        }
      }
    } catch {
      // Fallback
    }

    const data = {
      quickCards: {
        customers: {
          value: 128,
          changePercent: 12,
          trend: [40, 45, 42, 50, 55, 52, 60, 58, 65, 70, 68, 75],
        },
        suppliers: {
          value: 54,
          changePercent: 6,
          trend: [30, 32, 35, 33, 38, 40, 42, 41, 45, 48, 47, 50],
        },
        materialReq: {
          value: totalItems > 0 ? totalItems : 342,
          changePercent: -4,
          trend: [70, 68, 65, 66, 60, 58, 55, 57, 52, 50, 48, 45],
        },
        serviceReq: {
          value: 76,
          changePercent: 15,
          trend: [20, 25, 24, 30, 32, 35, 33, 40, 42, 45, 48, 52],
        },
        purchases: {
          value: totalStockValue,
          changePercent: 18,
          trend: [30, 35, 32, 40, 45, 42, 50, 55, 52, 60, 58, 65],
        },
        sales: {
          value: 153310,
          changePercent: 24,
          trend: [25, 28, 30, 35, 33, 40, 45, 43, 50, 55, 58, 62],
        },
      },
      purchaseDonut: {
        currentLabel: period,
        previousLabel: "Previous Period",
        currentPercent: 72,
      },
      purchaseVsConsumption: [
        { label: "Jan", purchase: 450000, consumption: 320000 },
        { label: "Feb", purchase: 520000, consumption: 410000 },
        { label: "Mar", purchase: 610000, consumption: 480000 },
        { label: "Apr", purchase: 580000, consumption: 510000 },
        { label: "May", purchase: 710000, consumption: 590000 },
        { label: "Jun", purchase: 840000, consumption: 680000 },
      ],
      pendingItems: [
        {
          project: "Sheba Eyecon Tower",
          contact: "Mr. Raju raz",
          addedBy: "Admin",
          date: "03-Sept-2026",
          reference: "SaleOffer-5154844",
          type: "Offer",
        },
        {
          project: "Lake Garden",
          contact: "Mr. Raju raz",
          addedBy: "Admin",
          date: "03-Sept-2026",
          reference: "SaleOffer-4181717",
          type: "Offer",
        },
      ],
      overflowMaterial: [
        {
          sl: 1,
          description: "Cement (OPC 52.5N)",
          budgetQty: 500,
          budgetAmount: 275000,
          issueQty: 560,
          issueAmount: 308000,
          status: "Issued",
        },
        {
          sl: 2,
          description: "MS Rod 20mm",
          budgetQty: 1200,
          budgetAmount: 912000,
          issueQty: 1340,
          issueAmount: 1018400,
          status: "Approved",
        },
        {
          sl: 3,
          description: "Bricks (1st Class)",
          budgetQty: 20000,
          budgetAmount: 240000,
          issueQty: 21500,
          issueAmount: 258000,
          status: "Pending",
        },
      ],
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate dashboard metrics" },
      { status: 500 }
    );
  }
}
