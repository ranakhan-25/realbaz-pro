"use client";

import React, { useState } from "react";
import {
  Plus,
  Download,
  Pencil,
  Trash2,
  Eye,
  FileText,
  List,
  Shield,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface EmployeeItem {
  id: number;
  sl: number;
  image?: string;
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: string;
  salaryGrade?: string;
  grossSalary: number;
  cv?: string;
  under: string;
}

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

const initialEmployeeData: EmployeeItem[] = [
  {
    id: 1,
    sl: 1,
    image: "",
    employeeCode: "12",
    name: "Mohin Uddin",
    department: "Customs",
    designation: "Tea Boy",
    joiningDate: "30 Jul 2026",
    status: "Active",
    salaryGrade: "-",
    grossSalary: 0,
    cv: "-",
    under: "Employee",
  },
  {
    id: 2,
    sl: 2,
    image: "",
    employeeCode: "03",
    name: "Rifat Hosain",
    department: "Engineering",
    designation: "Software Eng.",
    joiningDate: "01 Feb 2026",
    status: "Active",
    salaryGrade: "Grade 1",
    grossSalary: 22000,
    cv: "-",
    under: "Employee",
  },
  {
    id: 3,
    sl: 3,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    employeeCode: "02",
    name: "Tazmul Reza",
    department: "Engineering",
    designation: "Executive",
    joiningDate: "01 Jul 2024",
    status: "Active",
    salaryGrade: "-",
    grossSalary: 22000,
    cv: "-",
    under: "Employee",
  },
];

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<EmployeeItem[]>(initialEmployeeData);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Filter States
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedEmployeeType, setSelectedEmployeeType] = useState("");

  // Action Dropdown State
  const [activeActionId, setActiveActionId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
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

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Form Data:", formData);
    setIsModalOpen(false);
  };

  return (
    // Normal document flow — this app's layout (Topbar + sticky Sidebar,
    // main in normal flow) already handles page scrolling, so this page
    // shouldn't fight it by claiming its own 100vh box.
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-3 flex flex-col font-sans select-none">
      
      {/* Navigation Breadcrumb & Action Header */}
      <div className="flex flex-row items-center justify-between gap-2 mb-2">
        <nav className="text-xs md:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
            Home
          </span>
          <span>&gt;</span>
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
            Employee
          </span>
          <span>&gt;</span>
          <span className="text-slate-400 dark:text-slate-500 font-normal">
            Employee List
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer">
            <Download className="w-4 h-4" />
            Import CSV
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-3 flex flex-col">
        
        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-2.5">
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value="">Select Section</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value="">Select Department</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">
              Designation
            </label>
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value="">Select Designation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">
              Shift
            </label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value="">Select Shift</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">
              Employee Type
            </label>
            <select
              value={selectedEmployeeType}
              onChange={(e) => setSelectedEmployeeType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value="">Select Employee Type</option>
            </select>
          </div>
        </div>

        {/* Entries & Search Controls */}
        <div className="flex items-center justify-between gap-2 mb-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-0.5 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <span>Search:</span>
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 sm:w-56 px-2.5 py-1 text-xs md:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Table View — no forced internal height; grows with content and
            scrolls with the page, matching the rest of the app */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px] md:text-xs border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3 py-2 text-center w-12">SL</th>
                <th className="px-3 py-2 text-center w-14">IMG</th>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Designation</th>
                <th className="px-3 py-2">Joining Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Grade</th>
                <th className="px-3 py-2">Gross</th>
                <th className="px-3 py-2">CV</th>
                <th className="px-3 py-2">Under</th>
                <th className="px-3 py-2 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {employees.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-3 py-2 text-center text-slate-500 dark:text-slate-400 font-medium">
                    {item.sl}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200">
                    {item.employeeCode}
                  </td>
                  <td className="px-3 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer">
                    {item.name}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {item.department}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {item.designation}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.joiningDate}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {item.salaryGrade}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    ৳{item.grossSalary.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {item.cv}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {item.under}
                  </td>
                  
                  {/* Action Dropdown Column */}
                  <td className="px-3 py-2 text-center relative">
                    <button
                      onClick={() =>
                        setActiveActionId(
                          activeActionId === item.id ? null : item.id
                        )
                      }
                      className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      Action <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {activeActionId === item.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveActionId(null)}
                        />
                        <div className="absolute right-3 top-9 z-30 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 text-left text-xs font-medium">
                          <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer">
                            <Eye className="w-3.5 h-3.5 text-cyan-500" /> View Profile
                          </button>
                          <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer">
                            <FileText className="w-3.5 h-3.5 text-cyan-500" /> Documents
                          </button>
                          <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer">
                            <List className="w-3.5 h-3.5 text-cyan-500" /> Details List
                          </button>
                          <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer">
                            <Shield className="w-3.5 h-3.5 text-cyan-500" /> Security
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                          <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 shrink-0">
          <div>
            Showing <span className="font-semibold text-slate-700 dark:text-slate-200">1</span> to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{employees.length}</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{employees.length}</span> entries
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="flex items-center gap-1 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium">
              1
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1 mt-1 shrink-0">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Add New Employee
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleModalSubmit}
              className="p-5 overflow-y-auto space-y-4 text-xs md:text-sm flex-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select Option</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select Option</option>
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select Option</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Designation<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">Select Option</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-medium rounded-md bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs md:text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
