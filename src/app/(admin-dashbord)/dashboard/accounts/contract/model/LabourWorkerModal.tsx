"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface LabourWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LabourWorkerModal({
  isOpen,
  onClose,
}: LabourWorkerModalProps) {
  if (!isOpen) return null;

  // Form State (For future API integration)
  const [formData, setFormData] = useState({
    code: "WO1222447",
    name: "",
    businessOrganization: "",
    email: "",
    phoneMobile: "",
    address: "",
    creditLimit: "",
    dueDate: "",
    under: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Labour/Worker Data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 transition-all duration-200 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-slate-50 dark:bg-[#080d1a] rounded-xl shadow-2xl border border-slate-200 dark:border-[#1e293b] overflow-hidden flex flex-col transition-all my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#030712]">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Labour/Worker/Contractor
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Row 1 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Business/Organization
              </label>
              <input
                type="text"
                name="businessOrganization"
                placeholder="Enter Business Name"
                value={formData.businessOrganization}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter E-mail"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Phone/Mobile
              </label>
              <input
                type="text"
                name="phoneMobile"
                placeholder="Enter Phone/Mobile"
                value={formData.phoneMobile}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Credit Limit
              </label>
              <input
                type="text"
                name="creditLimit"
                placeholder="Enter Credit Limit"
                value={formData.creditLimit}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Row 5 */}
            <div className="md:col-span-1">
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Under
              </label>
              <select
                name="under"
                value={formData.under}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select One Option</option>
              </select>
            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-xs font-semibold rounded bg-slate-400 hover:bg-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}