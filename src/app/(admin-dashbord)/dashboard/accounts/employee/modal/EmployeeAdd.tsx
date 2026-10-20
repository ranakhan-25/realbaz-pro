"use client";

import React, { useState } from "react";
import { X, Plus, Calendar } from "lucide-react";

// TypeScript Interface for Form State
export interface EmployeeFormData {
  unit: string;
  section: string;
  code: string;
  name: string;
  phoneMobile: string;
  secondaryOfficeNumber: string;
  email: string;
  birthDate: string;
  employeeIdCode: string;
  department: string;
  designation: string;
  salaryGrade: string;
  grossSalary: string;
  maritalStatus: string;
  tin: string;
  shift: string;
  nid: string;
  joiningDate: string;
  leaveDate: string;
  cvFile: File | null;
  imageFile: File | null;
  status: string;
  employeeType: string;
  under: string;
  hasNomineeInfo: boolean;
  hasBankInfo: boolean;
  hasOtherInfo: boolean;
  createUser: boolean;
}

export default function EmployeeModalPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Form Initial State (Ready for API Integration)
  const [formData, setFormData] = useState<EmployeeFormData>({
    unit: "",
    section: "",
    code: "ST5982822",
    name: "",
    phoneMobile: "",
    secondaryOfficeNumber: "",
    email: "",
    birthDate: "",
    employeeIdCode: "",
    department: "",
    designation: "",
    salaryGrade: "",
    grossSalary: "",
    maritalStatus: "",
    tin: "",
    shift: "",
    nid: "",
    joiningDate: "",
    leaveDate: "",
    cvFile: null,
    imageFile: null,
    status: "",
    employeeType: "",
    under: "",
    hasNomineeInfo: false,
    hasBankInfo: false,
    hasOtherInfo: false,
    createUser: false,
  });

  // Handle Input Changes
  const handleChange = (
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

  // Handle File Input
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "cvFile" | "imageFile"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  // Form Submit Handler (API Ready)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* 
      ======================================================
      TODO: API Call Integration
      ======================================================
      const apiFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          apiFormData.append(key, value as any);
        }
      });

      try {
        const res = await fetch('/api/employees', {
          method: 'POST',
          body: apiFormData,
        });
        const data = await res.json();
        console.log("Success:", data);
      } catch (error) {
        console.error("Error submitting employee data:", error);
      }
    */

    console.log("Form Submitted with Data:", formData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black p-4 flex flex-col justify-between text-slate-800 dark:text-slate-100">
      {/* Background Trigger Button */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Employee Modal
        </button>
      </div>

      {/* EMPLOYEE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-[#131c31] rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#131c31]">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Employee
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                
                {/* ROW 1 */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* ROW 2 */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone/Mobile<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneMobile"
                    required
                    placeholder="Enter Phone/Mobile"
                    value={formData.phoneMobile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Secondary / Office Number
                  </label>
                  <input
                    type="text"
                    name="secondaryOfficeNumber"
                    placeholder="Enter Secondary / Office Number"
                    value={formData.secondaryOfficeNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Birth Date<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* ROW 3 */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Employee Id/Code<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeIdCode"
                    required
                    placeholder="Employee Code"
                    value={formData.employeeIdCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Designation<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Salary Grade
                  </label>
                  <select
                    name="salaryGrade"
                    value={formData.salaryGrade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                {/* ROW 4 */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Gross Salary<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="grossSalary"
                    required
                    placeholder="Gross Salary"
                    value={formData.grossSalary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Martial Status<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    TIN
                  </label>
                  <input
                    type="text"
                    name="tin"
                    placeholder="TIN Number"
                    value={formData.tin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Shift<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                {/* ROW 5 */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    NID<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="nid"
                    required
                    placeholder="NID"
                    value={formData.nid}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Joining Date<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    required
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Leave Date
                  </label>
                  <input
                    type="date"
                    name="leaveDate"
                    value={formData.leaveDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    CV (PDF Only Max:4MB)
                  </label>
                  <div className="flex items-center border border-slate-200 dark:border-[#1e293b] rounded-md overflow-hidden bg-slate-50 dark:bg-[#030712]">
                    <label className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "cvFile")}
                      />
                    </label>
                    <span className="px-3 py-2 text-slate-400 dark:text-slate-500 truncate">
                      {formData.cvFile ? formData.cvFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>

                {/* ROW 6 */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Image (Image Only(591x709px) Max:2MB)
                  </label>
                  <div className="flex items-center border border-slate-200 dark:border-[#1e293b] rounded-md overflow-hidden bg-slate-50 dark:bg-[#030712]">
                    <label className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "imageFile")}
                      />
                    </label>
                    <span className="px-3 py-2 text-slate-400 dark:text-slate-500 truncate">
                      {formData.imageFile
                        ? formData.imageFile.name
                        : "No file chosen"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select value</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Employee Type<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                {/* Other Information Pill Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-full px-4 py-2 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors w-fit">
                    <input
                      type="checkbox"
                      name="hasOtherInfo"
                      checked={formData.hasOtherInfo}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className="font-medium text-xs">
                      Other Information
                    </span>
                  </label>
                </div>

                {/* ROW 7 */}
                {/* Nominee Information Pill Checkbox */}
                <div>
                  <label className="flex items-center gap-2 bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-full px-4 py-2 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors w-fit">
                    <input
                      type="checkbox"
                      name="hasNomineeInfo"
                      checked={formData.hasNomineeInfo}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className="font-medium text-xs">
                      Nominee Information
                    </span>
                  </label>
                </div>

                {/* Bank Information Pill Checkbox */}
                <div>
                  <label className="flex items-center gap-2 bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-full px-4 py-2 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors w-fit">
                    <input
                      type="checkbox"
                      name="hasBankInfo"
                      checked={formData.hasBankInfo}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className="font-medium text-xs">
                      Bank Information
                    </span>
                  </label>
                </div>

                {/* Under Select Box */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Under<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="under"
                    value={formData.under}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select One Option</option>
                  </select>
                </div>

                {/* Create User Green Pill Checkbox */}
                <div>
                  <label className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-full px-4 py-2 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors w-fit">
                    <input
                      type="checkbox"
                      name="createUser"
                      checked={formData.createUser}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-medium text-xs">Create User</span>
                  </label>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-[#131c31] mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-xs font-semibold rounded-lg bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500 text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4 mt-6">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}