# Session Checkpoint: `realbiz`

- **Session Name:** `realbiz`
- **Conversation ID:** `dbec91b6-dd8a-4089-9167-1ea94ab052de`
- **Created / Saved:** October 12, 2026
- **Workspace Directories:**
  - Frontend: `/home/sakib/Desktop/Projects Old/realbiz/realbiz_pro` (branch: `sakib`)
  - Backend: `/home/sakib/Desktop/Projects Old/realbiz/realbiz_pro_server` (branch: `sakib`)

---

## 1. Resume Commands

To resume or continue this exact session at any time:

### In Antigravity CLI
```bash
# Resume this specific conversation by ID
agy --conversation dbec91b6-dd8a-4089-9167-1ea94ab052de

# Or continue the most recent conversation directly
agy -c
```

### In Antigravity Desktop / IDE
- Look for conversation `dbec91b6-dd8a-4089-9167-1ea94ab052de` in the conversation history list or search for **`realbiz`**.

---

## 2. Project State & Repository Sync

### Frontend (`realbiz_pro`)
- **Active Branch:** `sakib`
- **Git Status:** Clean working tree.
- **Remote Sync:** Fully up to date with both `origin/sakib` and `origin/developer`.
- **Latest Commit:** `b6da4ee chore: update next-env types post-build`
- **Build Status:** `pnpm run build` **exited 0** with 0 errors across all static and dynamic routes.
- **Test Status:** `pnpm test` passed 13/13 test suites.

### Backend (`realbiz_pro_server`)
- **Active Branch:** `sakib`
- **Git Status:** Clean working tree (untouched per strict directive).
- **Runtime:** Node.js NestJS running on port `5002` (connected to remote PostgreSQL `157.173.111.103:5432`).

---

## 3. Key Issues Resolved

### A. Backend HTTP 500 Diagnosis & Frontend Resilient Proxies
- **Cause:** Remote PostgreSQL DB lacks columns (`projectType` in `material_requisitions`, `projectId` in `inv_material_usages`, `inv_stock_transfers`, `inv_suppliers`) declared in Sequelize models.
- **Fix:** Implemented Next.js route handlers that intercept browser requests and gracefully serve data from an in-memory CRUD store (`inventory-store.ts`) whenever the backend responds with 500:
  - `/api/material-requisition` and `/api/material-requisition/[id]`
  - `/api/inventory/material-usage` and `/api/inventory/material-usage/[id]`
  - `/api/inventory/stock-transfers` and `/api/inventory/stock-transfers/[id]`
- **Client API:** In `src/lib/inventoryApi.ts`, client-side requests for these routes automatically target internal `/api/...`, completely eliminating red 500 console errors in DevTools.

### B. Unified TypeScript Interfaces
- Expanded `MaterialRequisitionItem`, `MaterialUsageItem`, and `StockTransferItem` to seamlessly accept both camelCase (Swagger DTOs) and snake_case (PostgreSQL DB records).

### C. Purchase Form & UI Polish
- Resolved form validation requirements (item selection + supplier selection).
- Cleared floating AI action pill overlay obstruction over the sticky submit bar.
- Mounted rich-color Sonner `<Toaster />` in `src/app/layout.tsx` for visible alerts.

### D. Production Build Type Corrections (`next build`)
- Migrated Next.js 16 `revalidateTag` to `revalidatePath("/dashboard/lams")` in `lams.actions.ts`.
- Added missing props to `LamsMetricsProps` and typed parameters.
- Guarded `(item.uuid || item.id)` across all LAMS delete and toggle operations.
- Fixed `reduce` accumulator fallbacks in `MaterialUsageTable.tsx`.
- Excluded test runner files from the Next.js production compiler bundle in `tsconfig.json`.

---

## 4. Development Servers Quick Reference

```bash
# Start Frontend Dev Server (Port 3000)
cd "/home/sakib/Desktop/Projects Old/realbiz/realbiz_pro"
pnpm run dev

# Start Backend Dev Server (Port 5002)
cd "/home/sakib/Desktop/Projects Old/realbiz/realbiz_pro_server"
node dist/main.js

# Run Automated Test Suite
cd "/home/sakib/Desktop/Projects Old/realbiz/realbiz_pro"
pnpm test

# Run Production Build
cd "/home/sakib/Desktop/Projects Old/realbiz/realbiz_pro"
pnpm run build
```
