/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Loader2, X } from "lucide-react";
import { API_BASE } from "../_shared";

interface DropdownOption { uuid: string; name: string; }
interface SalaryRecord {
  uuid: string;
  employeeId?: string;
  employeeCode?: string;
  [key: string]: string | number | undefined;
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "employee";
  required?: boolean;
  options?: { label: string; value: string }[];
  fullWidth?: boolean;
}

interface SectionConfig {
  id: string;
  title: string;
  apiPath: string;
  addLabel: string;
  columns: { key: string; label: string }[];
  fields: FieldConfig[];
}

const SECTIONS: SectionConfig[] = [
  {
    id: "employee-salary", title: "Set Salary", apiPath: "employee-salary", addLabel: "Add",
    columns: [{ key: "employeeCode", label: "Employee ID" }, { key: "basicSalary", label: "Basic Salary" }],
    fields: [
      { key: "employeeId", label: "Employee", type: "employee", required: true, fullWidth: true },
      { key: "basicSalary", label: "Basic salary", type: "number", required: true, fullWidth: true },
    ],
  },
  {
    id: "allowance", title: "Allowance", apiPath: "allowance", addLabel: "Add",
    columns: [
      { key: "employeeCode", label: "Employee ID" }, { key: "purpose", label: "Purpose" },
      { key: "type", label: "Type" }, { key: "paymentType", label: "Payment Type" },
      { key: "percentage", label: "Percentage %" }, { key: "amount", label: "Amount" },
    ],
    fields: [
      { key: "employeeId", label: "Employee", type: "employee", required: true, fullWidth: true },
      { key: "purpose", label: "Purpose", type: "text", required: true },
      { key: "type", label: "Type", type: "select", required: true, options: [{ label: "Percentage", value: "percentage" }, { label: "Fixed", value: "fixed" }] },
      { key: "paymentType", label: "Payment Type", type: "select", required: true, options: [{ label: "Monthly", value: "monthly" }, { label: "Daily", value: "daily" }] },
      { key: "percentage", label: "Percentage %", type: "number" },
      { key: "amount", label: "Amount", type: "number" },
    ],
  },
  {
    id: "commission", title: "Commission", apiPath: "commission", addLabel: "Add",
    columns: [
      { key: "employeeCode", label: "Employee ID" }, { key: "title", label: "Title" },
      { key: "type", label: "Type" }, { key: "commissionType", label: "Commission Type" },
      { key: "value", label: "Value" }, { key: "amount", label: "Amount" },
    ],
    fields: [
      { key: "employeeId", label: "Employee", type: "employee", required: true, fullWidth: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Type", type: "text", required: true },
      { key: "commissionType", label: "Commission Type", type: "text", required: true },
      { key: "value", label: "Value", type: "number" },
      { key: "amount", label: "Amount", type: "number" },
    ],
  },
  {
    id: "loan", title: "Loan", apiPath: "loan", addLabel: "Add",
    columns: [
      { key: "employeeCode", label: "Employee ID" }, { key: "type", label: "Type" },
      { key: "amount", label: "Amount" }, { key: "startDate", label: "Start" }, { key: "endDate", label: "End" },
    ],
    fields: [
      { key: "employeeId", label: "Employee", type: "employee", required: true, fullWidth: true },
      { key: "type", label: "Type", type: "text", required: true },
      { key: "amount", label: "Amount", type: "number", required: true },
      { key: "startDate", label: "Start Date", type: "date", required: true },
      { key: "endDate", label: "End Date", type: "date", required: true },
    ],
  },
  {
    id: "saturation-deduction", title: "Saturation Deduction", apiPath: "saturation-deduction", addLabel: "Add",
    columns: [
      { key: "employeeCode", label: "Employee ID" }, { key: "title", label: "Title" },
      { key: "amount", label: "Amount" }, { key: "paymentType", label: "Payment Type" },
    ],
    fields: [
      { key: "employeeId", label: "Employee", type: "employee", required: true, fullWidth: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "amount", label: "Amount", type: "number", required: true },
      { key: "paymentType", label: "Payment Type", type: "select", required: true, options: [{ label: "Monthly", value: "monthly" }] },
    ],
  },
  {
    id: "overtime", title: "OverTime", apiPath: "overtime", addLabel: "Overtime Add",
    columns: [
      { key: "employeeCode", label: "Employee ID" }, { key: "title", label: "Title" },
      { key: "type", label: "Type" }, { key: "amount", label: "Amount" },
    ],
    fields: [
      { key: "employeeId", label: "Employee", type: "employee", required: true, fullWidth: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Type", type: "text", required: true },
      { key: "amount", label: "Amount", type: "number", required: true },
    ],
  },
];

export default function SalaryStructurePage() {
  const [employees, setEmployees] = useState<DropdownOption[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/realbizpro/api/v1/employee-list?page=1&limit=100&status=active&withDeleted=false`, { cache: "no-store" })
      .then(res => res.json())
      .then((json: { data?: { data?: { uuid: string; name: string; employeeCode?: string }[] } }) => {
        const data = (json?.data?.data || []).map((e) => ({ uuid: e.uuid, name: e.name || e.employeeCode || "Unnamed" }));
        setEmployees(data);
      })
      .catch((err: unknown) => console.error("Employee load error", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-4">
          <div className="text-xs text-slate-500">Home / Employee / Salary Structure</div>
          <h1 className="text-xl font-bold">Salary Structure</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SECTIONS.map((sec) => (
            <SalarySection key={sec.id} config={sec} employees={employees} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SalarySection({ config, employees }: { config: SectionConfig; employees: DropdownOption[] }) {
  const [items, setItems] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SalaryRecord | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/realbizpro/api/v1/${config.apiPath}?page=1&limit=100&sortBy=createdAt&sortOrder=DESC&withDeleted=false`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json().catch(() => ({})) as { data?: { data?: SalaryRecord[] } };
      setItems(json?.data?.data || []);
    } catch (error: unknown) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (item?: SalaryRecord) => {
    setEditingItem(item || null);
    const initialVals: Record<string, string> = {};
    config.fields.forEach(f => { initialVals[f.key] = item?.[f.key]?.toString() || ""; });
    setFormValues(initialVals);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: SalaryRecord) => {
    if (!confirm("Delete this record?")) return;
    try {
      await fetch(`${API_BASE}/realbizpro/api/v1/${config.apiPath}/${item.uuid}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.uuid !== item.uuid));
    } catch (error: unknown) { 
      alert("Delete failed"); 
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, string | number> = { ...formValues };
    config.fields.forEach(f => { if (f.type === "number" && payload[f.key]) payload[f.key] = Number(payload[f.key]); });
    
    const url = editingItem?.uuid ? `${API_BASE}/realbizpro/api/v1/${config.apiPath}/${editingItem.uuid}` : `${API_BASE}/realbizpro/api/v1/${config.apiPath}`;
    const method = editingItem?.uuid ? "PATCH" : "POST";
    
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({})) as { message?: string };
      if (!res.ok) throw new Error(json?.message || "Failed to save");
      setIsModalOpen(false); 
      setEditingItem(null); 
      loadData();
    } catch (error: unknown) { 
      const msg = error instanceof Error ? error.message : "Something went wrong";
      alert(msg); 
    }
  };

  const filtered = items.filter((it) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return Object.values(it).some((val) => String(val).toLowerCase().includes(q));
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">{config.title}</h3>
        <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" /> {config.addLabel}
        </button>
      </div>

      <div className="flex justify-between items-center p-3 bg-slate-50 border-b border-slate-100 text-xs">
        <div>Show <select className="border rounded p-1"><option>10</option></select> entries</div>
        <div className="flex items-center gap-2">Search: <input value={search} onChange={e => setSearch(e.target.value)} className="border rounded px-2 py-1 w-32" /></div>
      </div>

      {loading ? <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-indigo-500 text-white uppercase text-[10px]">
              <tr>
                <th className="p-2">SL</th>
                {config.columns.map(c => <th key={c.key} className="p-2">{c.label}</th>)}
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.uuid} className="border-t hover:bg-slate-50">
                  <td className="p-2">{i + 1}</td>
                  {config.columns.map(c => {
                    let val = item[c.key];
                    if (c.key === "employeeCode" && !val) {
                      val = employees.find(e => e.uuid === item.employeeId)?.name || "—";
                    }
                    return <td key={c.key} className="p-2">{val || "—"}</td>;
                  })}
                  <td className="p-2">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => openModal(item)} className="p-1 bg-cyan-400 text-white rounded"><Edit3 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete(item)} className="p-1 bg-rose-500 text-white rounded"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={config.columns.length + 2} className="p-4 text-center text-slate-400">No data available in table</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
            <div className="flex justify-between p-4 border-b">
              <h3 className="font-bold">{editingItem ? `Edit ${config.title}` : `${config.title} Add`}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-rose-500 font-bold"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {config.fields.map(f => (
                  <div key={f.key} className={f.fullWidth ? "col-span-2" : ""}>
                    <label className="block text-xs font-medium mb-1">{f.label} {f.required && "*"}</label>
                    {f.type === "employee" ? (
                       <select 
                         value={formValues[f.key] || ""} 
                         onChange={e => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))} 
                         className="w-full border p-2 rounded text-sm" required={f.required}
                       >
                         <option value="">Select Employee</option>
                         {employees.map(emp => <option key={emp.uuid} value={emp.uuid}>{emp.name}</option>)}
                       </select>
                    ) : f.type === "select" ? (
                      <select 
                        value={formValues[f.key] || ""} 
                        onChange={e => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))} 
                        className="w-full border p-2 rounded text-sm" required={f.required}
                      >
                        <option value="">Select</option>
                        {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input 
                        type={f.type} 
                        value={formValues[f.key] || ""} 
                        onChange={e => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))} 
                        className="w-full border p-2 rounded text-sm" required={f.required} 
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-400 text-white rounded text-sm">Close</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}