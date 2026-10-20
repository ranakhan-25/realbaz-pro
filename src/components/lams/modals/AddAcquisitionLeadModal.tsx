"use client";

import React, { useState, useEffect } from "react";
import { X, PlusCircle } from "lucide-react";
import { AcquisitionLead, LeadStage, LeadSource } from "@/types/lams";

interface AddAcquisitionLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
    onAddLead: (lead: AcquisitionLead) => void;
}

const DISTRICTS = ["Dhaka", "Narayanganj", "Gazipur", "Munshiganj"];
const UPAZILAS = ["Rupganj", "Keraniganj", "Savar", "Gazipur Sadar", "Sonargaon"];
const STAGES: LeadStage[] = [
  "New",
  "Contacted",
  "In Negotiation",
  "Legal Verification",
  "Agreement Ready",
  "Acquired",
];
const SOURCES: LeadSource[] = [
  "Direct Owner",
  "Broker/Agent",
  "Bank Auction",
  "Referral",
  "Field Survey",
];
const USERS = ["Sakib Al Hasan", "Rezaul Karim", "Tanvir Hossain", "Shamim Khan"];

export function AddAcquisitionLeadModal({
  isOpen,
  onClose,
  onAddLead,
    editData,
}: AddAcquisitionLeadModalProps) {
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [upazila, setUpazila] = useState(UPAZILAS[0]);
  const [mouza, setMouza] = useState("");
  const [dagNo, setDagNo] = useState("");
  const [khatianNo, setKhatianNo] = useState("");
  const [landArea, setLandArea] = useState<number>(25.0);
  const [landType, setLandType] = useState<AcquisitionLead["landType"]>("Residential");
  const [leadStage, setLeadStage] = useState<LeadStage>("New");
  const [leadSource, setLeadSource] = useState<LeadSource>("Direct Owner");
  const [assignedUser, setAssignedUser] = useState(USERS[0]);
  const [expectedPrice, setExpectedPrice] = useState<number>(35000000);
  const [offeredPrice, setOfferedPrice] = useState<number>(30000000);
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [address, setAddress] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (isOpen && editData) {
      setTitle(editData.title || "");
      setDistrict(editData.district || DISTRICTS[0]);
      setUpazila(editData.upazila || UPAZILAS[0]);
      setMouza(editData.mouza || "");
      setDagNo(editData.dagNo || "");
      setKhatianNo(editData.khatianNo || "");
      setLandArea(editData.landArea || 25.0);
      setLandType(editData.landType || "Residential");
      setLeadStage(editData.leadStage || "New");
      setLeadSource(editData.leadSource || "Direct Owner");
      setAssignedUser(editData.assignedUser || USERS[0]);
      setExpectedPrice(editData.expectedPrice || 35000000);
      setOfferedPrice(editData.offeredPrice || 30000000);
      setOwnerName(editData.ownerName || "");
      setOwnerPhone(editData.ownerPhone || "");
      setOwnerAddress(editData.ownerAddress || "");
      setAddress(editData.address || "");
      setRemarks(editData.remarks || "");
    } else if (isOpen && !editData) {
      // reset 
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !mouza || !dagNo) return;

    const newLead: AcquisitionLead = {
      id: `AL-${Date.now()}`,
      leadCode: `AL-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      address: address || `${mouza}, ${upazila}, ${district}`,
      district,
      upazila,
      mouza,
      dagNo,
      khatianNo: khatianNo || "RS-Pending",
      landArea: Number(landArea) || 10,
      landAreaUnit: "Decimal",
      landType,
      leadStage,
      leadSource,
      leadStatus: "Active",
      assignedUser,
      expectedPrice: Number(expectedPrice) || 0,
      offeredPrice: Number(offeredPrice) || 0,
      ownerName: ownerName || "Unassigned Owner",
      ownerPhone: ownerPhone || "+880 1700-000000",
      ownerAddress: ownerAddress || address,
      createdAt: new Date().toISOString().split("T")[0],
      remarks,
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Land Acquisition Lead
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register a new prospective land parcel into the acquisition pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Section: Basic Lead Details */}
          <div>
            <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2.5">
              1. Land Parcel Identification
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parcel Title / Location Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Purbachal Sector 17 Riverfront Parcel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Land Area (Decimals) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upazila / Thana <span className="text-rose-500">*</span>
                </label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mouza <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Baghber / Kayetpara"
                  value={mouza}
                  onChange={(e) => setMouza(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dag No. (Plot) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1405, 1406"
                  value={dagNo}
                  onChange={(e) => setDagNo(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Khatian No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. RS-892, BS-1204"
                  value={khatianNo}
                  onChange={(e) => setKhatianNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Land Type
                </label>
                <select
                  value={landType}
                  onChange={(e) => setLandType(e.target.value as AcquisitionLead["landType"])}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed-use">Mixed-use</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Pipeline & Financials */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2.5">
              2. Pipeline Stage & Valuation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lead Stage
                </label>
                <select
                  value={leadStage}
                  onChange={(e) => setLeadStage(e.target.value as LeadStage)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lead Source
                </label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {SOURCES.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned User
                </label>
                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {USERS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Price (৳ BDT)
                </label>
                <input
                  type="number"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section: Owner Info */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2.5">
              3. Land Owner Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alhaj M. A. Latif"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Phone
                </label>
                <input
                  type="text"
                  placeholder="+880 1711-000000"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uttara Sector 3, Dhaka"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remarks & Strategic Significance
            </label>
            <textarea
              rows={2}
              placeholder="Road frontage, proximity to highway, boundary status..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20"
            >
              Save Acquisition Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
