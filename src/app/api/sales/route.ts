import { NextRequest, NextResponse } from "next/server";
import { fallbackSales } from "@/lib/inventoryApi";

// In-memory store for sales during dev session so POST saves and GET fetches immediately
let salesStore: any[] = [...fallbackSales];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: salesStore.length > 0 ? salesStore : fallbackSales,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSale = {
      id: Date.now(),
      projectType: body.projectType || "Real Estate",
      project: body.project || "Head Office",
      titleOfWork: body.titleOfWork || "General",
      customerName: body.customerName || "Customer",
      code: body.code || `SALE-${Date.now().toString().slice(-6)}`,
      ref: body.ref || `REF-${Date.now().toString().slice(-4)}`,
      date: body.date || new Date().toISOString().split("T")[0],
      grandTotal: Number(body.grandTotal || 0),
      addedBy: body.addedBy || "Admin",
      attachment: body.attachment || "-",
      approve: body.approve || "Approved",
      createdAt: new Date().toISOString(),
    };
    salesStore.unshift(newSale);
    return NextResponse.json({
      success: true,
      data: newSale,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create sale" },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    salesStore = salesStore.filter((s) => String(s.id) !== String(id));
  }
  return NextResponse.json({ success: true });
}
