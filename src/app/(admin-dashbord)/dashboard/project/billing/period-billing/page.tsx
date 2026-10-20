/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, ArrowLeft, X, Loader2 } from "lucide-react";

// ==================== API CONFIG ====================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";
const API_PREFIX = "/realbizpro/api/v1";

export default function PeriodBillPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Dropdown Data (API theke asbe)
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    customerId: "",
    ledgerId: "",
    code: `PB0000${Math.floor(10 + Math.random() * 90)}`,
    siteId: "",
    refWoNo: "",
    startDate: "",
    endDate: "",
    projectId: "",
    projectCost: 0,
    percentage: 0,
    grandTotal: 0,
    contentBody: "",
    attachment: "",
  });

  // ==================== API FETCHERS ====================
  const fetchOptions = async (endpoint: string) => {
    try {
      const res = await fetch(`${API_BASE}${API_PREFIX}${endpoint}?page=1&limit=100`);
      if (!res.ok) return [];
      const json = await res.json();
      const rows = json?.data?.data || json?.data || [];
      return rows.map((r: any) => ({
        uuid: r.uuid,
        name: r.name || r.projectName || r.title || r.itemName || r.code || "Unnamed",
      }));
    } catch (err) {
      return [];
    }
  };

  const loadDropdowns = useCallback(async () => {
    const [cust, proj, types, ledger, site] = await Promise.all([
      fetchOptions("/customer"),
      fetchOptions("/project"),
      fetchOptions("/project-type"),
      fetchOptions("/ledger"), // Assuming you have a ledger API
      fetchOptions("/project-sites"),
    ]);
    setCustomers(cust);
    setProjects(proj);
    setProjectTypes(types);
    setLedgers(ledger);
    setSites(site);
  }, []);

  const loadBills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // ⚠️ API endpoint ta apnar backend onujayi change korun
      const res = await fetch(`${API_BASE}${API_PREFIX}/period-bill?page=1&limit=100`);
      if (!res.ok) throw new Error("Failed to load period bills");
      const json = await res.json();
      setBills(json?.data?.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBills();
    loadDropdowns();
  }, [loadBills, loadDropdowns]);

  // ==================== CALCULATIONS ====================
  // Auto calculate Grand Total based on Percentage and Project Cost
  useEffect(() => {
    const cost = Number(formData.projectCost) || 0;
    const percent = Number(formData.percentage) || 0;
    const total = (cost * percent) / 100;
    setFormData((prev) => ({ ...prev, grandTotal: total }));
  }, [formData.projectCost, formData.percentage]);

  // ==================== HANDLERS ====================
  const handleCreateBill = async () => {
    try {
      setLoading(true);
      console.log("📤 Sending Period Bill Payload:", formData);

      const res = await fetch(`${API_BASE}${API_PREFIX}/period-bill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create period bill");
      
      alert("Period Bill created successfully!");
      setIsAddOpen(false);
      loadBills();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 font-sans text-slate-900">
      
      {/* ==================== LIST VIEW ==================== */}
      {!isAddOpen && (
        <div className="max-w-[1600px] mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-1">Home / Billing / Period Bill List</div>
              <h1 className="text-xl font-bold">Period Bill List</h1>
            </div>
            <button onClick={() => setIsAddOpen(true)} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
              <Plus className="w-4 h-4" /> +New Period Billing
            </button>
          </div>

          {loading && <div className="text-center py-10"><Loader2 className="animate-spin inline mr-2"/>Loading...</div>}
          {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg">{error}</div>}

          <div className="bg-white border rounded-xl shadow-sm overflow-visible">
            <div className="p-3 bg-slate-50 border-b flex justify-between items-center">
               <div className="flex gap-2">
                 <button className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-semibold">Excel</button>
                 <button className="bg-rose-600 text-white px-3 py-1.5 rounded text-xs font-semibold">PDF</button>
               </div>
               <div className="relative w-64">
                 <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                 <input type="text" placeholder="Search..." className="border pl-9 pr-3 py-1.5 rounded-lg text-sm w-full" />
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-indigo-600 text-white uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Project Type</th>
                    <th className="py-2 px-3">Project</th>
                    <th className="py-2 px-3">Customer Name</th>
                    <th className="py-2 px-3">Code</th>
                    <th className="py-2 px-3">Ref</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Start Date</th>
                    <th className="py-2 px-3">End Date</th>
                    <th className="py-2 px-3 text-right">Construction Cost</th>
                    <th className="py-2 px-3 text-right">Service Charge</th>
                    <th className="py-2 px-3">Added By</th>
                    <th className="py-2 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bills.map((bill, index) => (
                    <tr key={bill.uuid || index}>
                      <td className="py-2 px-3">{index + 1}</td>
                      <td className="py-2 px-3">{bill.projectType?.name || "-"}</td>
                      <td className="py-2 px-3">{bill.project?.name || "-"}</td>
                      <td className="py-2 px-3">{bill.customer?.name || "-"}</td>
                      <td className="py-2 px-3">{bill.code}</td>
                      <td className="py-2 px-3">{bill.refWoNo || "-"}</td>
                      <td className="py-2 px-3">{bill.date}</td>
                      <td className="py-2 px-3">{bill.startDate || "-"}</td>
                      <td className="py-2 px-3">{bill.endDate || "-"}</td>
                      <td className="py-2 px-3 text-right">{Number(bill.projectCost || 0).toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">{Number(bill.grandTotal || 0).toFixed(2)}</td>
                      <td className="py-2 px-3">{bill.createdBy || "Admin"}</td>
                      <td className="py-2 px-3 text-center">
                         <button className="bg-indigo-600 text-white text-[11px] px-3 py-1.5 rounded">Action</button>
                      </td>
                    </tr>
                  ))}
                  {bills.length === 0 && !loading && (
                    <tr><td colSpan={13} className="text-center py-10 text-slate-400">No data available in table</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD VIEW ==================== */}
      {isAddOpen && (
        <div className="max-w-[1600px] mx-auto bg-white border border-slate-200 rounded-xl shadow-lg p-6 space-y-6">
          
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsAddOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">Period Billing Add</h2>
            </div>
            <button onClick={() => setIsAddOpen(false)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold">Period Billing List</button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Customer</label>
              <select value={formData.customerId} onChange={(e) => setFormData({ ...formData, customerId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="">Select value</option>
                {customers.map(c => <option key={c.uuid} value={c.uuid}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Ledger</label>
              <select value={formData.ledgerId} onChange={(e) => setFormData({ ...formData, ledgerId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="">Select Ledger</option>
                {ledgers.map(l => <option key={l.uuid} value={l.uuid}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Code</label>
              <input type="text" value={formData.code} readOnly className="w-full border rounded-lg px-3 py-2 bg-slate-50" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Site</label>
              <select value={formData.siteId} onChange={(e) => setFormData({ ...formData, siteId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="">Select Site</option>
                {sites.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Ref. WO No.</label>
              <input type="text" value={formData.refWoNo} onChange={(e) => setFormData({ ...formData, refWoNo: e.target.value })} placeholder="PO No." className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Project</label>
              <select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="">Select value</option>
                {projects.map(p => <option key={p.uuid} value={p.uuid}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Project Cost</label>
              <input type="number" value={formData.projectCost} onChange={(e) => setFormData({ ...formData, projectCost: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Percentage</label>
              <div className="relative">
                <input type="number" value={formData.percentage} onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 pr-8" />
                <span className="absolute right-3 top-2 text-slate-500">%</span>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Grand Total</label>
              <input type="number" value={formData.grandTotal} readOnly className="w-full border rounded-lg px-3 py-2 bg-slate-50 font-bold" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-600 mb-1">Attachment</label>
              <input type="file" className="w-full border rounded-lg px-3 py-1.5 text-slate-500" />
            </div>
          </div>

          {/* Rich Text Editor Placeholder */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b p-2 flex gap-2 text-xs">
              <span className="font-semibold text-slate-600 mr-2 py-1">Content Body</span>
              <button className="p-1 hover:bg-slate-200 rounded">B</button>
              <button className="p-1 hover:bg-slate-200 rounded italic">I</button>
              <button className="p-1 hover:bg-slate-200 rounded underline">U</button>
            </div>
            <textarea rows={5} value={formData.contentBody} onChange={(e) => setFormData({ ...formData, contentBody: e.target.value })} placeholder="Write your content here..." className="w-full p-3 text-sm focus:outline-none resize-none" />
          </div>

          <div className="flex justify-center pt-4 border-t">
             <button onClick={handleCreateBill} disabled={loading} className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm flex items-center gap-2">
               {loading ? <Loader2 className="animate-spin w-4 h-4"/> : "Submit"}
             </button>
          </div>
        </div>
      )}

    </div>
  );
}