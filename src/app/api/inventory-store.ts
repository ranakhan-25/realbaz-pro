import {
  fallbackMaterialRequisitions,
  fallbackMaterialUsage,
  fallbackStockTransfers,
} from "@/lib/inventoryApi";

// In-memory persistent stores across route calls in the Node.js runtime
declare global {
  // eslint-disable-next-line no-var
  var __requisitionsStore: any[] | undefined;
  // eslint-disable-next-line no-var
  var __materialUsageStore: any[] | undefined;
  // eslint-disable-next-line no-var
  var __stockTransfersStore: any[] | undefined;
}

if (!globalThis.__requisitionsStore) {
  globalThis.__requisitionsStore = [...fallbackMaterialRequisitions];
}

if (!globalThis.__materialUsageStore) {
  globalThis.__materialUsageStore = [...fallbackMaterialUsage];
}

if (!globalThis.__stockTransfersStore) {
  globalThis.__stockTransfersStore = [...fallbackStockTransfers];
}

// ---------------------------------------------------------------------------
// 1. Material Requisitions Store Helpers
// ---------------------------------------------------------------------------
export function getRequisitionsStore() {
  return globalThis.__requisitionsStore!;
}

export function addRequisition(item: any) {
  globalThis.__requisitionsStore!.unshift(item);
  return item;
}

export function getRequisitionById(id: string | number) {
  return globalThis.__requisitionsStore!.find(
    (r) => String(r.id) === String(id) || String(r.uuid) === String(id),
  );
}

export function updateRequisition(id: string | number, patch: any) {
  const index = globalThis.__requisitionsStore!.findIndex(
    (r) => String(r.id) === String(id) || String(r.uuid) === String(id),
  );
  if (index >= 0) {
    globalThis.__requisitionsStore![index] = {
      ...globalThis.__requisitionsStore![index],
      ...patch,
    };
    return globalThis.__requisitionsStore![index];
  }
  return null;
}

export function deleteRequisition(id: string | number) {
  const initialLength = globalThis.__requisitionsStore!.length;
  globalThis.__requisitionsStore = globalThis.__requisitionsStore!.filter(
    (r) => String(r.id) !== String(id) && String(r.uuid) !== String(id),
  );
  return globalThis.__requisitionsStore!.length < initialLength;
}

// ---------------------------------------------------------------------------
// 2. Material Usage Store Helpers
// ---------------------------------------------------------------------------
export function getMaterialUsageStore() {
  return globalThis.__materialUsageStore!;
}

export function addMaterialUsage(item: any) {
  globalThis.__materialUsageStore!.unshift(item);
  return item;
}

export function getMaterialUsageById(id: string | number) {
  return globalThis.__materialUsageStore!.find(
    (m) => String(m.id) === String(id) || String(m.usage_no) === String(id),
  );
}

export function updateMaterialUsage(id: string | number, patch: any) {
  const index = globalThis.__materialUsageStore!.findIndex(
    (m) => String(m.id) === String(id) || String(m.usage_no) === String(id),
  );
  if (index >= 0) {
    globalThis.__materialUsageStore![index] = {
      ...globalThis.__materialUsageStore![index],
      ...patch,
    };
    return globalThis.__materialUsageStore![index];
  }
  return null;
}

export function deleteMaterialUsage(id: string | number) {
  const initialLength = globalThis.__materialUsageStore!.length;
  globalThis.__materialUsageStore = globalThis.__materialUsageStore!.filter(
    (m) => String(m.id) !== String(id) && String(m.usage_no) !== String(id),
  );
  return globalThis.__materialUsageStore!.length < initialLength;
}

// ---------------------------------------------------------------------------
// 3. Stock Transfers Store Helpers
// ---------------------------------------------------------------------------
export function getStockTransfersStore() {
  return globalThis.__stockTransfersStore!;
}

export function addStockTransfer(item: any) {
  globalThis.__stockTransfersStore!.unshift(item);
  return item;
}

export function getStockTransferById(id: string | number) {
  return globalThis.__stockTransfersStore!.find(
    (s) => String(s.id) === String(id) || String(s.transfer_no) === String(id) || String(s.code) === String(id),
  );
}

export function updateStockTransfer(id: string | number, patch: any) {
  const index = globalThis.__stockTransfersStore!.findIndex(
    (s) => String(s.id) === String(id) || String(s.transfer_no) === String(id) || String(s.code) === String(id),
  );
  if (index >= 0) {
    globalThis.__stockTransfersStore![index] = {
      ...globalThis.__stockTransfersStore![index],
      ...patch,
    };
    return globalThis.__stockTransfersStore![index];
  }
  return null;
}

export function deleteStockTransfer(id: string | number) {
  const initialLength = globalThis.__stockTransfersStore!.length;
  globalThis.__stockTransfersStore = globalThis.__stockTransfersStore!.filter(
    (s) => String(s.id) !== String(id) && String(s.transfer_no) !== String(id) && String(s.code) !== String(id),
  );
  return globalThis.__stockTransfersStore!.length < initialLength;
}
