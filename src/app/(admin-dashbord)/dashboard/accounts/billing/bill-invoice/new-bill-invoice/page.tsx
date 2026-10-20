"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  X,
  MoreVertical,
  Trash2,
  Edit,
  Calendar,
  Undo2,
  Redo2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ImageIcon,
  Printer,
  Eye,
  Play,
  Smile,
} from "lucide-react";

// Types
export interface InvoiceItemRow {
  id: number;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  image: string | null;
  amount: number;
}

export interface PaymentRow {
  id: number;
  transactionId: string;
  paymentMethod: string;
  chequeReceiptNo: string;
  amount: number;
  date: string;
}

export default function CreateInvoicePage() {
  // Main Form States
  const [billDate, setBillDate] = useState("2026-09-13");
  const [customer, setCustomer] = useState("");
  const [ledger, setLedger] = useState("100-003-001-Sales");
  const [billCode, setBillCode] = useState("BILL8364415");
  const [projectType, setProjectType] = useState("");
  const [project, setProject] = useState("");
  const [site, setSite] = useState("");
  const [refNo, setRefNo] = useState("");
  const [contentBody, setContentBody] = useState("");

  // Select Item Filter Bar
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");

  // Invoice Items State
  const [items, setItems] = useState<InvoiceItemRow[]>([
    {
      id: 1,
      name: "Paint Work Service",
      description: "Exterior wall weather coat paint work",
      unit: "Sft",
      quantity: 1000,
      rate: 15,
      image: null,
      amount: 15000,
    },
  ]);

  // Calculation States
  const [discount, setDiscount] = useState<number>(0);
  const [isVatIncluded, setIsVatIncluded] = useState(false);
  const [vatPercent, setVatPercent] = useState<number>(0);
  const [isAitIncluded, setIsAitIncluded] = useState(false);
  const [aitPercent, setAitPercent] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);

  // Payments State
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isCheque, setIsCheque] = useState(false);
  const [paymentDate, setPaymentDate] = useState("2026-09-13");
  const [chequeReceiptNo, setChequeReceiptNo] = useState("");
  const [payAmount, setPayAmount] = useState<number | string>(0);

  // Modals & Action Controls
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [activeItemDropdownId, setActiveItemDropdownId] = useState<
    number | null
  >(null);
  const [activePayDropdownId, setActivePayDropdownId] = useState<number | null>(
    null,
  );

  // Dynamic Item Form States (Modal 1)
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemSubCategory, setNewItemSubCategory] = useState("");
  const [newItemBrand, setNewItemBrand] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemPurchasePrice, setNewItemPurchasePrice] = useState("");
  const [newItemSalePrice, setNewItemSalePrice] = useState("");

  // Dynamic Customer Form States (Modal 2)
  const [custCode, setCustCode] = useState("CUS9306043");
  const [custName, setCustName] = useState("");
  const [custMobile, setCustMobile] = useState("");
  const [custRef, setCustRef] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custCreditLimit, setCustCreditLimit] = useState("");
  const [custDueDate, setCustDueDate] = useState("");
  const [custOpeningBal, setCustOpeningBal] = useState("");
  const [custChartGroup, setCustChartGroup] = useState("");

  // Calculated Values
  const subTotal = items.reduce((acc, item) => acc + item.amount, 0);
  const vatAmount = isVatIncluded ? (subTotal * (vatPercent || 0)) / 100 : 0;
  const aitAmount = isAitIncluded ? (subTotal * (aitPercent || 0)) / 100 : 0;
  const interestAmount = (subTotal * (interestRate || 0)) / 100;
  const grandTotal =
    subTotal - discount + vatAmount + aitAmount + interestAmount;
  const totalPaid = payments.reduce((acc, pay) => acc + pay.amount, 0);
  const dueAmount = grandTotal - totalPaid;

  // Add Item to Table Direct
  const handleAddItemRow = () => {
    if (!selectedItemName) return;
    const newItem: InvoiceItemRow = {
      id: Date.now(),
      name: selectedItemName,
      description: "Standard item description",
      unit: "Pcs",
      quantity: 1,
      rate: 100,
      image: null,
      amount: 100,
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedItemName("");
  };

  // Add Item Submit Handler (Modal)
  const handleCreateNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      category: newItemCategory,
      subCategory: newItemSubCategory,
      brand: newItemBrand,
      name: newItemName,
      unit: newItemUnit,
      purchasePrice: newItemPurchasePrice,
      salePrice: newItemSalePrice,
    };
    console.log("Create Item API Payload:", payload);
    setIsItemModalOpen(false);
  };

  // Customer Submit Handler (Modal)
  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: custCode,
      name: custName,
      mobile: custMobile,
      ref: custRef,
      address: custAddress,
      creditLimit: custCreditLimit,
      dueDate: custDueDate,
      openingBal: custOpeningBal,
      chartGroup: custChartGroup,
    };
    console.log("Create Customer API Payload:", payload);
    setIsCustomerModalOpen(false);
  };

  // Add Payment Handler
  const handleAddPayment = () => {
    const numAmt = Number(payAmount);
    if (!numAmt || numAmt <= 0) return;

    const newPayment: PaymentRow = {
      id: Date.now(),
      transactionId: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: isCheque ? "Cheque" : paymentMethod,
      chequeReceiptNo: isCheque ? chequeReceiptNo : "-",
      amount: numAmt,
      date: paymentDate,
    };

    setPayments((prev) => [...prev, newPayment]);
    setPayAmount(0);
    setChequeReceiptNo("");
  };

  // Remove Item
  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setActiveItemDropdownId(null);
  };

  // Remove Payment
  const handleRemovePayment = (id: number) => {
    setPayments((prev) => prev.filter((pay) => pay.id !== id));
    setActivePayDropdownId(null);
  };

  // Final Form Submit (API Connection Point)
  const handleSubmitInvoice = () => {
    const fullInvoicePayload = {
      billDate,
      customer,
      ledger,
      billCode,
      projectType,
      project,
      site,
      refNo,
      contentBody,
      items,
      subTotal,
      discount,
      vatPercent,
      vatAmount,
      aitPercent,
      aitAmount,
      interestRate,
      interestAmount,
      grandTotal,
      totalPaid,
      dueAmount,
      payments,
    };

    console.log("Submit Invoice API Request Payload:", fullInvoicePayload);
    alert("Invoice Submitted Successfully!");
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-3 text-xs flex flex-col justify-between">
      <div>
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Link
              href="/"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">
              Billing <ChevronDown className="w-3 h-3" />
            </span>
            <span>&gt;</span>
            <span className="text-slate-400 font-normal truncate">
              Invoice/Bill List
            </span>
          </nav>

          {/* Top Right Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsItemModalOpen(true)}
              className="px-3 py-1.5 bg-[#10B981] hover:bg-emerald-600 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs flex items-center gap-1"
            >
              Item Add
            </button>
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="px-3 py-1.5 bg-[#10B981] hover:bg-emerald-600 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs flex items-center gap-1"
            >
              Contacts Add
            </button>
            {/* Link Routing for Bill List */}
            <Link
              href="/dashboard/accounts/billing/invoice"
              className="px-3 py-1.5 bg-[#10B981] hover:bg-emerald-600 text-white font-medium rounded transition-colors shadow-xs text-xs flex items-center gap-1"
            >
              Bill List
            </Link>
          </div>
        </div>

        {/* Section 1: Main Form Inputs (Grid Row 1 & 2) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-3 mb-3 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Customer
              </label>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
              >
                <option value="">Select One Option</option>
                <option value="Rahim Chowdhury">Rahim Chowdhury</option>
                <option value="Apex Real Estate">Apex Real Estate</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Ledger
              </label>
              <div className="relative flex items-center">
                <select
                  value={ledger}
                  onChange={(e) => setLedger(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 pr-7"
                >
                  <option value="100-003-001-Sales">100-003-001-Sales</option>
                  <option value="100-003-002-Services">
                    100-003-002-Services
                  </option>
                </select>
                {ledger && (
                  <X
                    className="w-3.5 h-3.5 absolute right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                    onClick={() => setLedger("")}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Code
              </label>
              <input
                type="text"
                value={billCode}
                onChange={(e) => setBillCode(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Project Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
              >
                <option value="">Select value</option>
                <option value="Building">Building</option>
                <option value="Interior">Interior</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Project
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
              >
                <option value="">Select Project</option>
                <option value="Global Link City">Global Link City</option>
                <option value="Green Tower">Green Tower</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Site
              </label>
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
              >
                <option value="">Select Site</option>
                <option value="Site A - Uttara">Site A - Uttara</option>
                <option value="Site B - Mirpur">Site B - Mirpur</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Ref W/O No.
              </label>
              <input
                type="text"
                placeholder="PO No."
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Content Body Editor (TinyMCE Style Bar) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded mb-3 shadow-xs">
          <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-[11px]">
            Content Body
          </div>

          {/* Editor Menu Bar */}
          <div className="flex items-center gap-3 px-3 py-1 text-[11px] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <span className="cursor-pointer hover:text-indigo-600">File</span>
            <span className="cursor-pointer hover:text-indigo-600">Edit</span>
            <span className="cursor-pointer hover:text-indigo-600">View</span>
            <span className="cursor-pointer hover:text-indigo-600">Insert</span>
            <span className="cursor-pointer hover:text-indigo-600">Format</span>
            <span className="cursor-pointer hover:text-indigo-600">Tools</span>
            <span className="cursor-pointer hover:text-indigo-600">Table</span>
          </div>

          {/* Toolbar Icons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <select className="text-xs bg-transparent outline-none">
              <option>Paragraph</option>
            </select>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            rows={3}
            value={contentBody}
            onChange={(e) => setContentBody(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-950 outline-none text-xs resize-none"
            placeholder=""
          />
          <div className="px-3 py-1 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 text-right">
            0 WORDS POWERED BY TINY
          </div>
        </div>

        {/* Section 3: Category & Select Item Dropdowns Bar (Image 13_2.PNG) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="">Select Category</option>
              <option value="Building Works">Building Works</option>
              <option value="Paint Works">Paint Works</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Sub Category
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="">Select Sub Category</option>
              <option value="Exterior">Exterior</option>
              <option value="Interior">Interior</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Select Item (Product / Material){" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedItemName}
              onChange={(e) => setSelectedItemName(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="">Search Item / Product / Material...</option>
              <option value="Weather Coat Paint">Weather Coat Paint</option>
              <option value="Cement Bag">Cement Bag</option>
            </select>
          </div>
        </div>

        {/* Section 4: Item Table & Subtotal Calculations (Image 13_2.PNG) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded mb-3 shadow-xs overflow-hidden">
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <thead className="bg-[#635BFF] text-white font-semibold uppercase text-[10px]">
              <tr>
                <th className="w-[20%] px-3 py-2">ITEM NAME</th>
                <th className="w-[25%] px-3 py-2">DESCRIPTION</th>
                <th className="w-[10%] px-3 py-2">UNIT</th>
                <th className="w-[10%] px-3 py-2">QUANTITY</th>
                <th className="w-[10%] px-3 py-2">RATE</th>
                <th className="w-[10%] px-3 py-2">IMAGE</th>
                <th className="w-[10%] px-3 py-2">AMOUNT</th>
                <th className="w-[5%] px-1 py-2 text-center">
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="p-1 bg-[#10B981] hover:bg-emerald-600 rounded text-white cursor-pointer inline-flex items-center justify-center"
                    title="Add Item Row"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-3 py-2 text-slate-800 dark:text-slate-100 truncate">
                    {item.name}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 truncate">
                    {item.description}
                  </td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                    {item.unit}
                  </td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                    {item.rate}
                  </td>
                  <td className="px-3 py-2 text-slate-400">-</td>
                  <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-100">
                    ৳{item.amount}
                  </td>
                  <td className="px-1 py-2 text-center relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveItemDropdownId(
                          activeItemDropdownId === item.id ? null : item.id,
                        )
                      }
                      className="p-1 rounded bg-[#00B5D8] hover:bg-cyan-600 text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {activeItemDropdownId === item.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveItemDropdownId(null)}
                        />
                        <div className="absolute right-2 mt-1 w-28 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 z-20 py-1 text-left">
                          <button
                            type="button"
                            onClick={() => setActiveItemDropdownId(null)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-indigo-500" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal Calculation Bar Grid (Image 13_2.PNG) */}
          <div className="bg-[#635BFF] text-white p-1.5 grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5 text-[10px] uppercase font-semibold">
            <div>SUBTOTAL</div>
            <div>DISCOUNT</div>
            <div className="flex items-center gap-1">
              VAT(%) IF INCLUDE:
              <input
                type="checkbox"
                checked={isVatIncluded}
                onChange={(e) => setIsVatIncluded(e.target.checked)}
                className="rounded"
              />
            </div>
            <div>VAT AMOUNT</div>
            <div className="flex items-center gap-1">
              AIT(%) IF INCLUDE:
              <input
                type="checkbox"
                checked={isAitIncluded}
                onChange={(e) => setIsAitIncluded(e.target.checked)}
                className="rounded"
              />
            </div>
            <div>AIT AMOUNT</div>
            <div>INTEREST RATE(%)</div>
            <div>INTEREST AMOUNT</div>
            <div>GRAND TOTAL</div>
            <div>PAID</div>
          </div>

          <div className="p-1.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5 border-t border-slate-200 dark:border-slate-800">
            <input
              type="number"
              readOnly
              value={subTotal}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none"
            />
            <input
              type="number"
              placeholder="discount"
              value={discount || ""}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none"
            />
            <input
              type="number"
              placeholder="Vat(%)"
              disabled={!isVatIncluded}
              value={vatPercent || ""}
              onChange={(e) => setVatPercent(Number(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900"
            />
            <input
              type="number"
              readOnly
              value={vatAmount}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none"
            />
            <input
              type="number"
              placeholder="AIT(%)"
              disabled={!isAitIncluded}
              value={aitPercent || ""}
              onChange={(e) => setAitPercent(Number(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900"
            />
            <input
              type="number"
              readOnly
              value={aitAmount}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none"
            />
            <input
              type="number"
              placeholder="Interest(%)"
              value={interestRate || ""}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none"
            />
            <input
              type="number"
              readOnly
              value={interestAmount}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none"
            />
            <input
              type="number"
              readOnly
              value={grandTotal}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 font-semibold outline-none"
            />
            <input
              type="number"
              readOnly
              value={totalPaid}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-700 dark:text-slate-200 font-semibold outline-none"
            />
          </div>
        </div>

        {/* Section 5: Bottom Split Section (Payment Table & Payment Box) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Payment History Table */}
          <div className="bg-[#FFFDF0] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2 shadow-xs flex flex-col justify-between">
            <div className="overflow-hidden">
              <div className="bg-[#635BFF] text-white grid grid-cols-6 p-1.5 text-[10px] font-semibold uppercase text-center rounded-t">
                <div>TRANSACTION ID</div>
                <div>PAYMENT METHOD</div>
                <div>CHEQUE RECEIPT NO</div>
                <div>AMOUNT</div>
                <div>DATE</div>
                <div>ACTION</div>
              </div>

              {payments.length > 0 ? (
                payments.map((pay) => (
                  <div
                    key={pay.id}
                    className="grid grid-cols-6 p-1.5 text-xs border-b border-slate-200 dark:border-slate-800 text-center items-center"
                  >
                    <div className="truncate">{pay.transactionId}</div>
                    <div>{pay.paymentMethod}</div>
                    <div>{pay.chequeReceiptNo}</div>
                    <div className="font-semibold">৳{pay.amount}</div>
                    <div>{pay.date}</div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActivePayDropdownId(
                            activePayDropdownId === pay.id ? null : pay.id,
                          )
                        }
                        className="p-1 rounded bg-[#00B5D8] text-white cursor-pointer"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>

                      {activePayDropdownId === pay.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActivePayDropdownId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-slate-900 rounded shadow-md border border-slate-200 dark:border-slate-800 z-20 py-1 text-left">
                            <button
                              type="button"
                              onClick={() => handleRemovePayment(pay.id)}
                              className="w-full flex items-center gap-1.5 px-2 py-1 text-red-600 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 italic text-xs">
                  No payments added yet
                </div>
              )}
            </div>

            <div className="pt-2 text-right font-medium text-xs text-slate-600 dark:text-slate-400">
              DUE AMOUNT:{" "}
              <span className="text-red-500 font-bold">৳{dueAmount}</span>
            </div>
          </div>

          {/* Payment Addition Form Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Payment Method<span className="text-red-500">*</span>{" "}
                  <span className="font-normal text-[10px]">
                    <input
                      type="checkbox"
                      checked={isCheque}
                      onChange={(e) => setIsCheque(e.target.checked)}
                      className="ml-1 mr-0.5 rounded"
                    />{" "}
                    if Cheque
                  </span>
                </label>
                <select
                  disabled={isCheque}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 disabled:bg-slate-100"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Cheque Receipt No
                </label>
                <input
                  type="text"
                  placeholder="Cheque Receipt No"
                  disabled={!isCheque}
                  value={chequeReceiptNo}
                  onChange={(e) => setChequeReceiptNo(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Amount<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleAddPayment}
                className="px-4 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded text-xs cursor-pointer shadow-xs transition-colors"
              >
                Add Payment
              </button>

              <button
                type="button"
                onClick={handleSubmitInvoice}
                className="px-6 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded text-xs cursor-pointer shadow-xs transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: NEW ITEM MODAL (Image 14_2.PNG) */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                New Item
              </h3>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateNewItemSubmit}
              className="p-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Building">Building</option>
                    <option value="Paint">Paint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Sub Category
                  </label>
                  <select
                    value={newItemSubCategory}
                    onChange={(e) => setNewItemSubCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  >
                    <option value="">Select Sub Category</option>
                    <option value="Exterior">Exterior</option>
                    <option value="Interior">Interior</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Brand
                  </label>
                  <div className="flex items-center gap-1">
                    <select
                      value={newItemBrand}
                      onChange={(e) => setNewItemBrand(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                    >
                      <option value="">Select Brand</option>
                      <option value="Berger">Berger</option>
                      <option value="Asian">Asian</option>
                    </select>
                    <button
                      type="button"
                      className="p-1.5 bg-[#635BFF] text-white rounded cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="Item Name"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Unit
                  </label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  >
                    <option value="">Select Unit</option>
                    <option value="Sft">Sft</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Purchase Price"
                    value={newItemPurchasePrice}
                    onChange={(e) => setNewItemPurchasePrice(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Sale Price
                </label>
                <input
                  type="number"
                  placeholder="Sale Price"
                  value={newItemSalePrice}
                  onChange={(e) => setNewItemSalePrice(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-5 py-1.5 rounded bg-slate-400 text-white font-medium text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#635BFF] text-white font-medium text-xs cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOMER ADD MODAL (Image 15_2.PNG) */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Customer Add
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateCustomerSubmit}
              className="p-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    value={custCode}
                    onChange={(e) => setCustCode(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Mobile"
                    value={custMobile}
                    onChange={(e) => setCustMobile(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Buyer Reference
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Business Name"
                    value={custRef}
                    onChange={(e) => setCustRef(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Address"
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Credit Limit
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Credit Limit"
                    value={custCreditLimit}
                    onChange={(e) => setCustCreditLimit(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={custDueDate}
                    onChange={(e) => setCustDueDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    placeholder="Opening Balance"
                    value={custOpeningBal}
                    onChange={(e) => setCustOpeningBal(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Chart Of Groups<span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={custChartGroup}
                  onChange={(e) => setCustChartGroup(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="">Select One Option</option>
                  <option value="Sundry Debtors">Sundry Debtors</option>
                  <option value="Customers Account">Customers Account</option>
                </select>
              </div>

              <div className="flex items-center justify-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-5 py-1.5 rounded bg-slate-400 text-white font-medium text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#635BFF] text-white font-medium text-xs cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}
