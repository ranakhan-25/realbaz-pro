"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

// Nominee Item Type Definition
interface NomineeItem {
  id: number;
  name: string;
  nid: string;
  phone: string;
  relation: string;
  percentage: string;
}

// Modal Props Interface
interface CustomerModalPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerModalPage({ isOpen, onClose }: CustomerModalPageProps) {
  if (!isOpen) return null;

  // Customer Form State
  const [formData, setFormData] = useState({
    code: "CUS7807088",
    name: "",
    mobile: "",
    email: "admin@admin.com",
    nidPassport: "",
    address: "",
    buyerReference: "",
    creditLimit: "",
    businessOrganization: "",
    chartOfGroups: "",
    image: null as File | null,
    createUser: false,
  });

  // Nominee List State
  const [nominees, setNominees] = useState<NomineeItem[]>([
    { id: 1, name: "", nid: "", phone: "", relation: "", percentage: "" },
  ]);

  // Handler for Customer Inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Nominee Input Change
  const handleNomineeChange = (
    index: number,
    field: keyof NomineeItem,
    value: string
  ) => {
    const updated = [...nominees];
    updated[index] = { ...updated[index], [field]: value };
    setNominees(updated);
  };

  // Add New Nominee Row
  const handleAddNominee = () => {
    setNominees((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        nid: "",
        phone: "",
        relation: "",
        percentage: "",
      },
    ]);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, nominees };
    console.log("Submitting Customer Data:", payload);
    onClose();
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 transition-all duration-200 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all my-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Customer Add
          </h2>
          {/* Close Icon Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Main Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* LEFT SECTION: Customer Details */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                Customer Details
              </h3>

              <div className="space-y-3.5 text-xs">
                {/* Row 1: Code, Name, Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Mobile <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: E-mail, NID/Birth Certificate/Passport, Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1 leading-tight">
                      NID/Birth Certificate/Passport
                    </label>
                    <input
                      type="text"
                      name="nidPassport"
                      placeholder="NID"
                      value={formData.nidPassport}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Buyer Reference, Credit Limit, Business/Organization */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Buyer Reference
                    </label>
                    <input
                      type="text"
                      name="buyerReference"
                      placeholder="Buyer Reference"
                      value={formData.buyerReference}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Credit Limit
                    </label>
                    <input
                      type="text"
                      name="creditLimit"
                      placeholder="Credit Limit"
                      value={formData.creditLimit}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Business/Organization
                    </label>
                    <input
                      type="text"
                      name="businessOrganization"
                      value={formData.businessOrganization}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 4: Chart Of Groups, Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Chart Of Groups <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="chartOfGroups"
                      value={formData.chartOfGroups}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select One Option</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                      Image
                    </label>
                    <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-950 overflow-hidden">
                      <label className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-200 border-r border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              image: e.target.files?.[0] || null,
                            }))
                          }
                        />
                      </label>
                      <span className="px-2.5 text-slate-500 dark:text-slate-400 truncate">
                        {formData.image ? formData.image.name : "No file chosen"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkbox: Create User */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="createUser"
                    name="createUser"
                    checked={formData.createUser}
                    onChange={handleInputChange}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-950"
                  />
                  <label
                    htmlFor="createUser"
                    className="text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    Create User
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION: Nominee Details */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  Nominee Details
                </h3>

                {/* Header Banner */}
                <div className="bg-indigo-600 text-white font-medium text-xs px-3 py-1.5 rounded-t-md">
                  Nominee Details
                </div>

                {/* Nominee Input Fields Table/Grid */}
                <div className="bg-white dark:bg-slate-900 border border-t-0 border-slate-200 dark:border-slate-700 p-3 rounded-b-md space-y-3">
                  {nominees.map((nominee, index) => (
                    <div
                      key={nominee.id}
                      className="grid grid-cols-12 gap-1.5 items-center text-xs"
                    >
                      <div className="col-span-3">
                        <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                          Nominee Name
                        </label>
                        <input
                          type="text"
                          placeholder="Nominee Name"
                          value={nominee.name}
                          onChange={(e) =>
                            handleNomineeChange(index, "name", e.target.value)
                          }
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1 truncate">
                          Nominee NID
                        </label>
                        <input
                          type="text"
                          placeholder="Nominee NID"
                          value={nominee.nid}
                          onChange={(e) =>
                            handleNomineeChange(index, "nid", e.target.value)
                          }
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          placeholder="Phone"
                          value={nominee.phone}
                          onChange={(e) =>
                            handleNomineeChange(
                              index,
                              "phone",
                              e.target.value
                            )
                          }
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                          Relation
                        </label>
                        <input
                          type="text"
                          placeholder="Relation"
                          value={nominee.relation}
                          onChange={(e) =>
                            handleNomineeChange(
                              index,
                              "relation",
                              e.target.value
                            )
                          }
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1 truncate">
                          Percentage
                        </label>
                        <input
                          type="text"
                          placeholder="Percentage"
                          value={nominee.percentage}
                          onChange={(e) =>
                            handleNomineeChange(
                              index,
                              "percentage",
                              e.target.value
                            )
                          }
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="col-span-1 flex items-end justify-center pt-4">
                        <button
                          type="button"
                          onClick={handleAddNominee}
                          className="w-7 h-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center transition-colors shadow-sm"
                          title="Add Nominee Row"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Footer */}
          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold rounded bg-slate-500 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}