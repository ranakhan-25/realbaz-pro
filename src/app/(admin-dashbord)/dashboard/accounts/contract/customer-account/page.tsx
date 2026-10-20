"use client";

import React, { useState } from "react";
import {
  Users,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Phone,
  Mail,
  CreditCard,
  MapPin,
} from "lucide-react";

// =====================================================
// TypeScript Interfaces
// =====================================================
interface Customer {
  id: number;
  code: string;
  name: string;
  business: string;
  mobile: string;
  email: string;
  nid: string;
  under: number;
  address?: string;
}

const initialCustomerData: Customer[] = [
  {
    id: 1,
    code: "CUS7515110",
    name: "Sagor kumar",
    business: "-",
    mobile: "01733195160",
    email: "sagor@example.com",
    nid: "-",
    under: 790,
    address: "Dhaka",
  },
  {
    id: 2,
    code: "L260829-0016",
    name: "ABC International",
    business: "-",
    mobile: "01976601668",
    email: "admin@admin.com",
    nid: "N/A",
    under: 789,
    address: "Uttara",
  },
  {
    id: 3,
    code: "CUS5818120",
    name: "Vertex Group",
    business: "-",
    mobile: "01312345685",
    email: "-",
    nid: "-",
    under: 778,
    address: "Gulshan",
  },
  {
    id: 4,
    code: "CUS5294070",
    name: "Lakeview Developers",
    business: "-",
    mobile: "01312345684",
    email: "-",
    nid: "-",
    under: 777,
    address: "Banani",
  },
];

export default function CompleteCustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomerData);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Edit Mode Tracking (null means Adding new, otherwise it holds the customer being edited)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "CUS7807088",
    name: "",
    mobile: "",
    email: "admin@admin.com",
    nid: "",
    address: "",
    buyerReference: "",
    creditLimit: "",
    businessOrganization: "",
    chartOfGroups: "Select One Option",
    createUser: false,
  });

  // Action Handlers
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((cust) => cust.id !== id));
    }
  };

  const handleOpenProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsProfileModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      code: `CUS${Math.floor(100000 + Math.random() * 900000)}`,
      name: "",
      mobile: "",
      email: "admin@admin.com",
      nid: "",
      address: "",
      buyerReference: "",
      creditLimit: "",
      businessOrganization: "",
      chartOfGroups: "Select One Option",
      createUser: false,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      code: customer.code,
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email !== "-" ? customer.email : "admin@admin.com",
      nid: customer.nid !== "-" ? customer.nid : "",
      address: customer.address || "",
      buyerReference: "",
      creditLimit: "",
      businessOrganization: customer.business !== "-" ? customer.business : "",
      chartOfGroups: "Sundry Debtors",
      createUser: false,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert("Please fill required fields (Name, Mobile)!");
      return;
    }

    if (editingCustomer) {
      // Update Existing Customer
      setCustomers(
        customers.map((cust) =>
          cust.id === editingCustomer.id
            ? {
                ...cust,
                code: formData.code,
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email || "-",
                nid: formData.nid || "-",
                address: formData.address || "-",
                business: formData.businessOrganization || "-",
              }
            : cust
        )
      );
    } else {
      // Add New Customer
      const newCust: Customer = {
        id: Date.now(),
        code: formData.code,
        name: formData.name,
        business: formData.businessOrganization || "-",
        mobile: formData.mobile,
        email: formData.email || "-",
        nid: formData.nid || "-",
        under: 790,
        address: formData.address || "-",
      };
      setCustomers([newCust, ...customers]);
    }

    setIsModalOpen(false);
  };

  // Search & Pagination Logic
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage) || 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 font-medium">
        <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Home</span>
        <span>&gt;</span>
        <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Contact</span>
        <span>&gt;</span>
        <span className="text-slate-400 dark:text-slate-500">Customer List</span>
      </nav>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#080d1a] rounded-xl shadow-lg border border-slate-200 dark:border-[#131c31] p-5 mb-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Customer List</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage your customers and their information</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/20 hover:bg-emerald-50 transition-colors">
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 dark:bg-rose-950/20 hover:bg-rose-50 transition-colors">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Customer Add
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>entries</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, code, mobile..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-[#131c31] rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-[#030712] text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-[#131c31]">
                <th className="p-3 w-8 text-center"><input type="checkbox" className="rounded" /></th>
                <th className="p-3">ID</th>
                <th className="p-3">CODE</th>
                <th className="p-3">NAME</th>
                <th className="p-3">BUSINESS</th>
                <th className="p-3">MOBILE</th>
                <th className="p-3">EMAIL</th>
                <th className="p-3">NID/BIRTH CERTIFICATE/PASSPORT</th>
                <th className="p-3">UNDER</th>
                <th className="p-3 text-center">IMAGE</th>
                <th className="p-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#131c31]/80 bg-white dark:bg-[#080d1a]">
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-[#0e1628] transition-colors">
                    <td className="p-3 text-center"><input type="checkbox" className="rounded" /></td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{customer.id}</td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{customer.code}</td>
                    <td onClick={() => handleOpenProfile(customer)} className="p-3 text-blue-600 hover:underline cursor-pointer font-medium">
                      {customer.name}
                    </td>
                    <td className="p-3 text-slate-500">{customer.business}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{customer.mobile}</td>
                    <td className="p-3 text-slate-500">{customer.email}</td>
                    <td className="p-3 text-slate-500">{customer.nid}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{customer.under}</td>
                    <td className="p-3 text-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleOpenProfile(customer)} className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" title="Profile">
                          <User className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleOpenEditModal(customer)} className="p-1.5 rounded bg-amber-500 text-white hover:bg-amber-600 cursor-pointer" title="Edit">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="p-1.5 rounded bg-rose-600 text-white hover:bg-rose-700" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="p-6 text-center text-slate-400 italic">No customer data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 text-xs text-slate-500">
          <div>Showing {filteredCustomers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} entries</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1 border rounded disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded bg-blue-600 text-white font-medium">{currentPage}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1 border rounded disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ===================================================== */}
      {/* ADD / EDIT CUSTOMER MODAL (Screenshot design)         */}
      {/* ===================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 my-auto text-slate-800">
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-sm font-bold text-slate-800">
                {editingCustomer ? "Customer Edit" : "Customer Add"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                
                {/* Left Section: Customer Details */}
                <div className="space-y-4 border border-slate-200 rounded-xl p-4 bg-[#f8fafc]/50">
                  <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Customer Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Code <span className="text-red-500">*</span></label>
                      <input type="text" name="code" value={formData.code} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Name <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleFormChange} required placeholder="Name" className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Mobile <span className="text-red-500">*</span></label>
                      <input type="text" name="mobile" value={formData.mobile} onChange={handleFormChange} required placeholder="Mobile" className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">E-mail</label>
                      <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">NID/Birth Certificate/Passport</label>
                      <input type="text" name="nid" value={formData.nid} onChange={handleFormChange} placeholder="NID" className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleFormChange} placeholder="Address" className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Buyer Reference</label>
                      <input type="text" name="buyerReference" value={formData.buyerReference} onChange={handleFormChange} placeholder="Buyer Reference" className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Credit Limit</label>
                      <input type="text" name="creditLimit" value={formData.creditLimit} onChange={handleFormChange} placeholder="Credit Limit" className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Business/Organization</label>
                      <input type="text" name="businessOrganization" value={formData.businessOrganization} onChange={handleFormChange} placeholder="Organization" className="w-full border rounded-lg px-3 py-1.5 bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Chart Of Groups <span className="text-red-500">*</span></label>
                      <select name="chartOfGroups" value={formData.chartOfGroups} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-1.5 bg-white">
                        <option value="Select One Option">Select One Option</option>
                        <option value="Sundry Debtors">Sundry Debtors</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Image</label>
                      <input type="file" className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:border-0 file:rounded-md file:bg-slate-100" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input type="checkbox" name="createUser" checked={formData.createUser} onChange={handleFormChange} className="rounded" /> Create User
                    </label>
                  </div>
                </div>

                {/* Right Section: Nominee Details */}
                <div className="space-y-4 border border-slate-200 rounded-xl p-4 bg-[#f8fafc]/50">
                  <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Nominee Details</h3>
                  <div className="rounded-lg overflow-hidden border bg-white">
                    <div className="bg-[#655bea] px-4 py-2 text-white font-semibold text-xs">Nominee Details</div>
                    <div className="p-3 bg-slate-50 space-y-2">
                      <div className="grid grid-cols-5 gap-2 text-[11px] font-semibold text-slate-600">
                        <span>Nominee Name</span>
                        <span>Nominee NID</span>
                        <span>Phone</span>
                        <span>Relation</span>
                        <span>Percentage</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 items-center">
                        <input type="text" placeholder="Nominee Name" className="border rounded px-2 py-1 text-xs bg-white" />
                        <input type="text" placeholder="Nominee NID" className="border rounded px-2 py-1 text-xs bg-white" />
                        <input type="text" placeholder="Phone" className="border rounded px-2 py-1 text-xs bg-white" />
                        <input type="text" placeholder="Relation" className="border rounded px-2 py-1 text-xs bg-white" />
                        <div className="flex items-center gap-1">
                          <input type="text" placeholder="Percentage" className="border rounded px-2 py-1 text-xs bg-white w-full" />
                          <button type="button" className="w-7 h-7 rounded bg-[#655bea] text-white flex items-center justify-center shrink-0">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">Close</button>
                <button type="submit" className="px-6 py-2 bg-[#655bea] hover:bg-[#534ac7] text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-colors">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* 2. CUSTOMER PROFILE & PAYMENT DETAILS MODAL           */}
      {/* ===================================================== */}
      {isProfileModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#f5f7fa] rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200 my-auto text-slate-800">
            <div className="flex justify-end p-3 bg-white">
              <button onClick={() => setIsProfileModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Card Header */}
            <div className="bg-white mx-6 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 text-[11px] font-medium p-2 bg-slate-50 text-center">
                  Customer Image
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-lg font-bold text-slate-800">{selectedCustomer.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-600" /><span><strong>Mobile:</strong> {selectedCustomer.mobile}</span></div>
                    <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-600" /><span><strong>Email:</strong> {selectedCustomer.email}</span></div>
                    <div className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-indigo-600" /><span><strong>NID:</strong> {selectedCustomer.nid}</span></div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-600" /><span><strong>Address:</strong> {selectedCustomer.address || "Uttara"}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm">
                  <FileText className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>

            {/* Payment Details Table */}
            <div className="p-6 space-y-3">
              <div className="bg-[#655bea] text-white px-4 py-2.5 rounded-t-xl font-bold text-xs">Payment Details</div>
              <div className="bg-white rounded-b-xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#655bea] text-white font-semibold text-[11px] uppercase border-b border-indigo-400">
                      <th className="p-2.5 border-r border-indigo-400/50">SL</th>
                      <th className="p-2.5 border-r border-indigo-400/50">DATE</th>
                      <th className="p-2.5 border-r border-indigo-400/50">PARTICULAR</th>
                      <th className="p-2.5 border-r border-indigo-400/50">CASH / BANK PARTICULAR</th>
                      <th className="p-2.5 border-r border-indigo-400/50">VOUCHER NO</th>
                      <th className="p-2.5 border-r border-indigo-400/50 text-right">DEBIT</th>
                      <th className="p-2.5 border-r border-indigo-400/50 text-right">CREDIT</th>
                      <th className="p-2.5 text-right">BALANCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">No payment details available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t pt-4">
        <div>© 2026 Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}