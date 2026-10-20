import { NextRequest, NextResponse } from "next/server";
import {
  getMaterialUsageById,
  updateMaterialUsage,
  deleteMaterialUsage,
} from "@/app/api/inventory-store";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5002/realbizpro/api/v1";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const backendRes = await fetch(`${BACKEND_URL}/inventory/material-usage/${id}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(1500),
    }).catch(() => null);

    if (backendRes && backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {}

  const item = getMaterialUsageById(id);
  if (item) {
    return NextResponse.json({ success: true, data: item, ...item });
  }
  return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();

    try {
      const backendRes = await fetch(`${BACKEND_URL}/inventory/material-usage/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(1500),
      }).catch(() => null);

      if (backendRes && backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {}

    const updated = updateMaterialUsage(id, body);
    return NextResponse.json({ success: true, data: updated, ...updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    fetch(`${BACKEND_URL}/inventory/material-usage/${id}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(1500),
    }).catch(() => null);
  } catch {}

  deleteMaterialUsage(id);
  return NextResponse.json({ success: true });
}
