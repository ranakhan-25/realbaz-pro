"use client";

import React, { useState, useEffect } from "react";
import { X, CalendarPlus } from "lucide-react";
import { FollowUpItem, AcquisitionLead, FollowUpStatus } from "@/types/lams";

interface AddFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
    onAddFollowUp: (item: FollowUpItem) => void;
  acquisitionLeads: AcquisitionLead[];
}

export function AddFollowUpModal({
  isOpen,
  onClose,
  onAddFollowUp,
    editData,
  acquisitionLeads,
}: AddFollowUpModalProps) {
  const [acquisitionLeadId, setAcquisitionLeadId] = useState(acquisitionLeads[0]?.uuid || "");
  const [date, setDate] = useState("2026-09-18");
  const [followUpType, setFollowUpType] = useState<FollowUpItem["followUpType"]>("Office Meeting");
  const [status, setStatus] = useState<FollowUpStatus>("Pending");
  const [note, setNote] = useState("");
  const [assignedTo, setAssignedTo] = useState("Sakib Al Hasan");

  useEffect(() => {
    if (isOpen && editData) {
      setAcquisitionLeadId(editData.acquisitionLeadId || editData.lead_id || "");
      setDate(editData.date || (editData.follow_up_date ? new Date(editData.follow_up_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]));
      setFollowUpType(editData.followUpType || editData.follow_up_type || "Call");
      setStatus(editData.status || (editData.outcome === "Interested" ? "Completed" : "Pending"));
      setNote(editData.note || editData.remarks || "");
    } else if (isOpen && !editData) {
      const defaultId = acquisitionLeads[0]?.uuid || acquisitionLeads[0]?.id || "";
      if (!acquisitionLeadId || !acquisitionLeads.some((l) => (l.uuid || l.id) === acquisitionLeadId)) {
        setAcquisitionLeadId(defaultId);
      }
    }
  }, [isOpen, editData, acquisitionLeads]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveLeadId = acquisitionLeadId || acquisitionLeads[0]?.uuid || acquisitionLeads[0]?.id || "";
    const lead = acquisitionLeads.find((l) => (l.uuid || l.id) === effectiveLeadId) || acquisitionLeads[0];

    const newItem: FollowUpItem = {
      id: `FLW-${Date.now()}`,
      uuid: `FLW-${Date.now()}`,
      sl: Date.now(),
      date: date || new Date().toISOString().split("T")[0],
      acquisitionLeadId: effectiveLeadId,
      landDetails: lead ? `${lead.title} (${lead.mouza}), ${lead.landArea} Dec` : "Land Parcel",
      ownerDetails: lead ? `${lead.ownerName} (Owner)` : "Land Owner",
      contact: lead ? lead.ownerPhone : "+880 1711-000000",
      followUpType,
      status,
      note: note || "Routine follow up with landowner.",
      assignedTo: assignedTo || "Acquisition Officer",
    };

    onAddFollowUp(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Schedule Follow-Up Task
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log a call, site visit, office negotiation, or sub-registry visit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Acquisition Lead */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Acquisition Lead <span className="text-rose-500">*</span>
            </label>
            <select
              value={acquisitionLeadId}
              onChange={(e) => setAcquisitionLeadId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {acquisitionLeads.length > 0 ? (
                acquisitionLeads.map((l) => {
                  const lId = l.uuid || l.id;
                  return (
                    <option key={lId} value={lId}>
                      {l.title} — {l.ownerName} ({l.ownerPhone})
                    </option>
                  );
                })
              ) : (
                <option value="">No acquisition leads available</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Follow-Up Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Task Type */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activity Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={followUpType}
                onChange={(e) => setFollowUpType(e.target.value as FollowUpItem["followUpType"])}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Office Meeting">Office Meeting</option>
                <option value="Site Visit">Site Visit (GPS Demarcation)</option>
                <option value="Registry Office">Registry Office</option>
                <option value="Call">Phone Call</option>
                <option value="Legal Review">Legal Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Status */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FollowUpStatus)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Officer
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Follow-Up Agenda & Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Detail discussion items, documents to bring, milestone checklist..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20"
            >
              Add Follow Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
