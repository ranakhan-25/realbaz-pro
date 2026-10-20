/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, ArrowLeft, X, Loader2 } from "lucide-react";

// ==================== API CONFIG ====================
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";
const API_PREFIX = "/realbizpro/api/v1";

export default function ContractorWorkOrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLabourModalOpen, setIsLabourModalOpen] = useState(false);

  // Dropdown Data (API theke asbe)
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    code: `CW0000${Math.floor(10 + Math.random() * 90)}`,
    supplierId: "",
    projectId: "",
    projectTypeId: "",
    categoryId: "",
    subCategoryId: "",
    itemId: "",
    site: "",
    attachment: "",
    contentBody: "",
    vatPercent: 0,
    vatInclude: false,
    aitPercent: 0,
    aitInclude: false,
  });

  const [orderItems, setOrderItems] = useState<any[]>([]);

  // Calculations
  const subtotal = orderItems.reduce(
    (acc, item) => acc + Number(item.quantity) * Number(item.rate),
    0,
  );
  const vatAmount = formData.vatInclude
    ? (subtotal * formData.vatPercent) / 100
    : 0;
  const aitAmount = formData.aitInclude
    ? (subtotal * formData.aitPercent) / 100
    : 0;
  const grandTotal = subtotal + vatAmount + aitAmount;

  // ==================== API FETCHERS ====================
  const fetchOptions = async (endpoint: string) => {
    try {
      const res = await fetch(
        `${API_BASE}${API_PREFIX}${endpoint}?page=1&limit=100`,
      );
      if (!res.ok) return [];
      const json = await res.json();
      const rows = json?.data?.data || json?.data || [];
      return rows.map((r: any) => ({
        uuid: r.uuid,
        name:
          r.name ||
          r.projectName ||
          r.title ||
          r.itemName ||
          r.code ||
          "Unnamed",
      }));
    } catch (err) {
      return [];
    }
  };

  const loadDropdowns = useCallback(async () => {
    const [sup, proj, types, cats, subCats, itms] = await Promise.all([
      fetchOptions("/customer"), // Using customer API as supplier for now
      fetchOptions("/project"),
      fetchOptions("/project-type"),
      fetchOptions("/category"),
      fetchOptions("/billing-sub-category"),
      fetchOptions("/item"),
    ]);
    setSuppliers(sup);
    setProjects(proj);
    setProjectTypes(types);
    setCategories(cats);
    setSubCategories(subCats);
    setItems(itms);
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // ⚠️ API endpoint ta apnar backend onujayi change korun
      const res = await fetch(
        `${API_BASE}${API_PREFIX}/contractor-work-order?page=1&limit=100`,
      );
      if (!res.ok) throw new Error("Failed to load work orders");
      const json = await res.json();
      setOrders(json?.data?.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadDropdowns();
  }, [loadOrders, loadDropdowns]);

  // ==================== HANDLERS ====================
  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: String(Date.now()),
        itemName: "New Item",
        description: "",
        unit: "Nos",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
    setIsItemModalOpen(false);
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        subtotal,
        vatAmount,
        aitAmount,
        grandTotal,
        items: orderItems,
      };

      console.log("📤 Sending Work Order Payload:", payload);
      const res = await fetch(
        `${API_BASE}${API_PREFIX}/contractor-work-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Failed to create work order");
      alert("Work Order created successfully!");
      setIsAddOpen(false);
      loadOrders();
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
              <div className="text-xs text-slate-500 mb-1">
                Home / Billing / Contractor Work Order List
              </div>
              <h1 className="text-xl font-bold">Contractor Work Order List</h1>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" /> +Contractor Work Order
            </button>
          </div>

          {loading && (
            <div className="text-center py-10">
              <Loader2 className="animate-spin inline mr-2" />
              Loading...
            </div>
          )}
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white border rounded-xl shadow-sm overflow-visible">
            <div className="p-3 bg-slate-50 border-b flex justify-between items-center">
              <div className="flex gap-2">
                <button className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-semibold">
                  Excel
                </button>
                <button className="bg-rose-600 text-white px-3 py-1.5 rounded text-xs font-semibold">
                  PDF
                </button>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="border pl-9 pr-3 py-1.5 rounded-lg text-sm w-full"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-indigo-600 text-white uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Contractor Name</th>
                    <th className="py-2 px-3">WO No</th>
                    <th className="py-2 px-3">Ref. Invoice No</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-right">Sub Total</th>
                    <th className="py-2 px-3 text-right">VAT</th>
                    <th className="py-2 px-3 text-right">Discount</th>
                    <th className="py-2 px-3 text-right">Grand Total</th>
                    <th className="py-2 px-3">Added By</th>
                    <th className="py-2 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order, index) => (
                    <tr key={order.uuid || index}>
                      <td className="py-2 px-3">{index + 1}</td>
                      <td className="py-2 px-3">
                        {order.supplier?.name || "-"}
                      </td>
                      <td className="py-2 px-3">{order.code}</td>
                      <td className="py-2 px-3">{order.refInvoiceNo || "-"}</td>
                      <td className="py-2 px-3">{order.date}</td>
                      <td className="py-2 px-3 text-right">
                        {Number(order.subtotal || 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {Number(order.vatAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right">0.00</td>
                      <td className="py-2 px-3 text-right font-semibold">
                        {Number(order.grandTotal || 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        {order.createdBy || "Admin"}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button className="bg-indigo-600 text-white text-[11px] px-3 py-1.5 rounded">
                          Action
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center py-10 text-slate-400"
                      >
                        No data available in table
                      </td>
                    </tr>
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
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">
                Contractor Work Order Add
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsItemModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Item Add
              </button>
              <button
                onClick={() => setIsLabourModalOpen(true)}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Labour/Worker Add
              </button>
              <button
                onClick={() => setIsAddOpen(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Work Order List
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Supplier
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) =>
                  setFormData({ ...formData, supplierId: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select One Option</option>
                {suppliers.map((s) => (
                  <option key={s.uuid} value={s.uuid}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Code
              </label>
              <input
                type="text"
                value={formData.code}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Project Type
              </label>
              <select
                value={formData.projectTypeId}
                onChange={(e) =>
                  setFormData({ ...formData, projectTypeId: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select value</option>
                {projectTypes.map((t) => (
                  <option key={t.uuid} value={t.uuid}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Project
              </label>
              <select
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.uuid} value={p.uuid}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Site
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Select Site</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Attachment
              </label>
              <input
                type="file"
                className="w-full border rounded-lg px-3 py-1.5 text-slate-500"
              />
            </div>
          </div>

          {/* Item Selection Bar */}
          <div className="bg-slate-100 p-3 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Category
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Select Category</option>
                {categories.map((c) => (
                  <option key={c.uuid} value={c.uuid}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Sub Category
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Select Sub Category</option>
                {subCategories.map((sc) => (
                  <option key={sc.uuid} value={sc.uuid}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Select Item (Product / Material)
              </label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option value="">Select Item</option>
                {items.map((i) => (
                  <option key={i.uuid} value={i.uuid}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rich Text Editor Placeholder */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b p-2 flex gap-2 text-xs">
              <span className="font-semibold text-slate-600 mr-2 py-1">
                Content Body
              </span>
              <button className="p-1 hover:bg-slate-200 rounded">B</button>
              <button className="p-1 hover:bg-slate-200 rounded italic">
                I
              </button>
              <button className="p-1 hover:bg-slate-200 rounded underline">
                U
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Write your work order content here..."
              className="w-full p-3 text-sm focus:outline-none resize-none"
            />
          </div>

          {/* Work Order Items Table */}
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-3">Labour/Worker</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3 text-right">Rate</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        placeholder="Name"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select className="w-full border rounded px-2 py-1">
                        <option>Nos</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-semibold">0.00</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() =>
                          setOrderItems(
                            orderItems.filter((_, i) => i !== index),
                          )
                        }
                        className="text-rose-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orderItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-400">
                      No items added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Payment */}
          <div className="flex justify-end mt-4">
            <div className="w-full md:w-1/2 space-y-2 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded border">
                <span className="font-semibold text-slate-700">Subtotal:</span>
                <span className="w-32 bg-white border rounded px-2 py-1 text-right">
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded border">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Vat(%):</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vatInclude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vatInclude: e.target.checked,
                        })
                      }
                    />{" "}
                    If Include
                  </label>
                </div>
                <input
                  type="number"
                  value={formData.vatPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vatPercent: Number(e.target.value),
                    })
                  }
                  className="w-32 bg-white border rounded px-2 py-1"
                />
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded border">
                <span className="font-semibold text-slate-700">
                  Vat(Amount):
                </span>
                <span className="w-32 bg-slate-100 border rounded px-2 py-1 text-right">
                  {vatAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded border">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">AIT(%):</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.aitInclude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aitInclude: e.target.checked,
                        })
                      }
                    />{" "}
                    If Include
                  </label>
                </div>
                <input
                  type="number"
                  value={formData.aitPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aitPercent: Number(e.target.value),
                    })
                  }
                  className="w-32 bg-white border rounded px-2 py-1"
                />
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded border">
                <span className="font-semibold text-slate-700">
                  AIT(Amount):
                </span>
                <span className="w-32 bg-slate-100 border rounded px-2 py-1 text-right">
                  {aitAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-emerald-600 p-2 rounded border border-emerald-700 text-white font-bold">
                <span>Grand Total:</span>
                <span className="w-32 text-right">{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={handleCreateOrder}
              disabled={loading}
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL: NEW ITEM ==================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center bg-slate-50 px-5 py-3 border-b">
              <h3 className="font-bold text-slate-800">New Item</h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select className="w-full border rounded px-2 py-1.5">
                  <option>Select Category</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Brand</label>
                <select className="w-full border rounded px-2 py-1.5">
                  <option>Select Brand</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Item Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Unit</label>
                <select className="w-full border rounded px-2 py-1.5">
                  <option>Select Unit</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Purchase Price
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Sale Price</label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: LABOUR/WORKER ADD ==================== */}
      {isLabourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center bg-slate-50 px-5 py-3 border-b">
              <h3 className="font-bold text-slate-800">
                Labour/Worker/Contractor
              </h3>
              <button
                onClick={() => setIsLabourModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Code</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1.5 bg-slate-50"
                  readOnly
                  value={`CUS${Math.floor(100000 + Math.random() * 900000)}`}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone/Mobile</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Opening Balance
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Credit Limit</label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Under</label>
                <select className="w-full border rounded px-2 py-1.5">
                  <option>Select One Option</option>
                </select>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsLabourModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
