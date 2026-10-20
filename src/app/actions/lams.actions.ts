"use server";

import { revalidatePath } from "next/cache";
import {
  mockAcquisitionLeads,
  mockLandOwners,
  mockNegotiationRecords,
  mockLegalDocuments,
  mockFollowUpItems,
} from "@/data/lams/lams.mock";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5002/realbizpro/api/v1";

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
function safeDate(dateStr: string | undefined | null): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? new Date().toISOString().split("T")[0]
    : d.toISOString().split("T")[0];
}

// ----------------------------------------------------------------------
// Acquisition Leads
// ----------------------------------------------------------------------
export async function getAcquisitionLeads() {
  try {
    const res = await fetch(`${API_BASE_URL}/lams/acquisition-leads`, {
      cache: "no-store",
      next: { tags: ["lams-acquisition-leads"] },
    });
    if (!res.ok) {
      console.warn("Backend error fetching acquisition leads, falling back to mock");
      return mockAcquisitionLeads;
    }
    const json = await res.json();
    const rawData = json.data !== undefined ? json.data : json;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return mockAcquisitionLeads;
    }

    return rawData.map((item: any, idx: number) => {
      const idStr = String(item.id || item.uuid || `AL-${idx + 1}`);
      return {
        id: idStr,
        uuid: idStr,
        leadCode: item.lead_code || "AL-" + idStr.substring(0, 6).toUpperCase(),
        title: item.lead_title || item.title || "Prospective Land Parcel",
        address: item.address || "Savar, Dhaka",
        district: item.district || "Dhaka",
        upazila: item.upazila || "Savar",
        mouza: item.mouza || "Boliarpur",
        dagNo: item.dag_no || item.dagNo || "102",
        khatianNo: item.khatian_no || item.khatianNo || "RS-405",
        landArea: Number(item.land_area || item.landArea || 10),
        landAreaUnit: item.land_area_unit || "Decimal",
        landType: item.land_type || item.landType || "Commercial",
        leadStage: item.lead_status || item.leadStage || "New",
        leadSource: item.lead_source || item.leadSource || "Direct Owner",
        leadStatus: item.lead_status || "Active",
        assignedUser: item.assigned_user || item.assignedUser || "Sakib Al Hasan",
        expectedPrice: Number(item.expected_price || item.expectedPrice || 25000000),
        offeredPrice: Number(item.offered_price || item.offeredPrice || 22000000),
        ownerName: item.owner_name || item.ownerName || "Primary Landowner",
        ownerPhone: item.owner_phone || item.ownerPhone || "+880 1711-000000",
        ownerAddress: item.owner_address || item.ownerAddress || "Dhaka",
        createdAt: item.lead_date || item.createdAt || new Date().toISOString().split("T")[0],
        remarks: item.remarks || "",
        projectId: item.projectId || item.project_id,
      };
    });
  } catch (error) {
    console.warn("Network error in getAcquisitionLeads, using mock fallback:", error);
    return mockAcquisitionLeads;
  }
}

export async function createAcquisitionLead(data: any) {
  const payload = {
    lead_title: data.title || data.lead_title || "Prospective Parcel",
    lead_date: safeDate(data.createdAt || data.lead_date),
    land_type: data.landType || data.land_type || "Commercial",
    land_area: parseFloat(data.landArea || data.land_area) || 0,
    lead_status: data.leadStage || data.leadStatus || data.lead_status || "New",
    projectId: data.projectId,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/acquisition-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn("Backend createAcquisitionLead failed with status", res.status);
    }
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("Backend unavailable, client updated locally:", err);
    return payload;
  }
}

export async function updateAcquisitionLead(uuid: string, data: any) {
  const payload: any = {
    lead_title: data.title || data.lead_title || "Updated Lead",
    land_area: parseFloat(data.landArea || data.land_area) || undefined,
    land_type: data.landType || data.land_type || undefined,
    lead_status: data.leadStage || data.leadStatus || data.lead_status || undefined,
    lead_date: data.createdAt || data.lead_date ? safeDate(data.createdAt || data.lead_date) : undefined,
    projectId: data.projectId || undefined,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/acquisition-leads/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("Backend updateAcquisitionLead network error:", err);
    return payload;
  }
}

export async function deleteAcquisitionLead(uuid: string) {
  try {
    await fetch(`${API_BASE_URL}/lams/acquisition-leads/${uuid}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/lams");
  } catch (err) {
    console.warn("deleteAcquisitionLead error:", err);
  }
}

// ----------------------------------------------------------------------
// Land Owners
// ----------------------------------------------------------------------
export async function getLandOwners() {
  try {
    const res = await fetch(`${API_BASE_URL}/lams/land-owners`, {
      cache: "no-store",
      next: { tags: ["lams-land-owners"] },
    });
    if (!res.ok) {
      console.warn("Backend error fetching land owners, falling back to mock");
      return mockLandOwners;
    }
    const json = await res.json();
    const rawData = json.data !== undefined ? json.data : json;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return mockLandOwners;
    }

    return rawData.map((item: any, idx: number) => {
      const idStr = String(item.id || item.uuid || `LO-${idx + 1}`);
      return {
        id: idStr,
        uuid: idStr,
        code: item.code || "LW-" + idStr.substring(0, 6).toUpperCase(),
        acquisitionLeadId: item.lead_id || item.acquisitionLeadId || "",
        landPlot: item.land_plot || item.landPlot || "General Parcel",
        ownerName: item.name || item.ownerName || "Owner",
        isPrimary: item.owner_type === "Owner" || item.isPrimary === true,
        fatherName: item.father_name || item.fatherName || "-",
        nidNumber: item.nid_number || item.nidNumber || "",
        phone: item.contact_number || item.phone || "",
        address: item.address || "",
        status: (item.status || "Active") as "Active" | "Inactive",
        addedBy: item.added_by || item.addedBy || "Sakib Al Hasan",
        remarks: item.remarks || "",
        ownershipSharePercentage: Number(item.ownership_percentage || item.ownershipSharePercentage || 50),
        projectId: item.projectId || item.project_id,
      };
    });
  } catch (error) {
    console.warn("Network error in getLandOwners, using mock fallback:", error);
    return mockLandOwners;
  }
}

export async function createLandOwner(data: any) {
  const payload = {
    lead_id: data.acquisitionLeadId || data.lead_id,
    owner_type: data.owner_type || (data.isPrimary ? "Owner" : "Broker"),
    name: data.ownerName || data.name || "Owner",
    contact_number: data.phone || data.contact_number || "",
    email: data.email || "contact@example.com",
    address: data.address || "",
    nid_number: data.nidNumber || data.nid_number || "",
    ownership_percentage: parseFloat(data.ownershipSharePercentage || data.ownership_percentage) || 0,
    projectId: data.projectId,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/land-owners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("createLandOwner network error:", err);
    return payload;
  }
}

export async function updateLandOwner(uuid: string, data: any) {
  const payload: any = {};
  if (data.ownerName || data.name) payload.name = data.ownerName || data.name;
  if (data.phone || data.contact_number) payload.contact_number = data.phone || data.contact_number;
  if (data.address) payload.address = data.address;
  if (data.nidNumber || data.nid_number) payload.nid_number = data.nidNumber || data.nid_number;
  if (data.ownershipSharePercentage || data.ownership_percentage) {
    payload.ownership_percentage = parseFloat(data.ownershipSharePercentage || data.ownership_percentage);
  }
  if (data.owner_type || data.isPrimary !== undefined) {
    payload.owner_type = data.owner_type || (data.isPrimary ? "Owner" : "Broker");
  }
  if (data.acquisitionLeadId || data.lead_id) {
    payload.lead_id = data.acquisitionLeadId || data.lead_id;
  }
  if (data.projectId) payload.projectId = data.projectId;

  try {
    const res = await fetch(`${API_BASE_URL}/lams/land-owners/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("updateLandOwner network error:", err);
    return payload;
  }
}

export async function deleteLandOwner(uuid: string) {
  try {
    await fetch(`${API_BASE_URL}/lams/land-owners/${uuid}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/lams");
  } catch (err) {
    console.warn("deleteLandOwner error:", err);
  }
}

// ----------------------------------------------------------------------
// Negotiation Process
// ----------------------------------------------------------------------
export async function getNegotiationProcesses() {
  try {
    const res = await fetch(`${API_BASE_URL}/lams/negotiation-processes`, {
      cache: "no-store",
      next: { tags: ["lams-negotiation-processes"] },
    });
    if (!res.ok) {
      console.warn("Backend error fetching negotiations, using mock");
      return mockNegotiationRecords;
    }
    const json = await res.json();
    const rawData = json.data !== undefined ? json.data : json;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return mockNegotiationRecords;
    }

    return rawData.map((item: any, idx: number) => {
      const idStr = String(item.id || item.uuid || `NEG-${idx + 1}`);
      return {
        id: idStr,
        uuid: idStr,
        acquisitionLeadId: item.lead_id || item.acquisitionLeadId || "",
        leadTitle: item.lead_title || item.leadTitle || "Land Parcel",
        mouza: item.mouza || "Kayetpara",
        dagNo: item.dag_no || item.dagNo || "1405",
        offeredTotalPrice: Number(item.offered_price || item.offeredTotalPrice || 0),
        offeredPricePerDecimal: Number(item.offered_price_per_decimal || item.offeredPricePerDecimal || 0),
        counterOfferByOwner: Number(item.agreed_price || item.counterOfferByOwner || 0),
        counterPricePerDecimal: Number(item.counter_price_per_decimal || item.counterPricePerDecimal || 0),
        negotiationStatus: item.negotiation_status || item.negotiationStatus || "In Progress",
        meetingDate: item.negotiation_date
          ? new Date(item.negotiation_date).toLocaleString()
          : item.meetingDate || "",
        attendedBy: item.attended_by || item.attendedBy || "Sakib Al Hasan",
        remarks: item.meeting_notes || item.remarks || "",
        projectId: item.projectId || item.project_id,
      };
    });
  } catch (error) {
    console.warn("Network error in getNegotiationProcesses, using mock fallback:", error);
    return mockNegotiationRecords;
  }
}

export async function createNegotiationProcess(data: any) {
  const payload = {
    lead_id: data.acquisitionLeadId || data.lead_id,
    negotiation_date: safeDate(data.meetingDate || data.negotiation_date),
    offered_price: parseFloat(data.offeredTotalPrice || data.offered_price) || 0,
    agreed_price: parseFloat(data.counterOfferByOwner || data.agreed_price) || 0,
    negotiation_status: data.negotiationStatus || data.negotiation_status || "In Progress",
    next_meeting_date: safeDate(data.next_meeting_date || data.meetingDate),
    meeting_notes: data.remarks || data.meeting_notes || "",
    projectId: data.projectId,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/negotiation-processes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("createNegotiationProcess network error:", err);
    return payload;
  }
}

export async function updateNegotiationProcess(uuid: string, data: any) {
  const payload: any = {
    lead_id: data.acquisitionLeadId || data.lead_id || undefined,
    negotiation_status: data.negotiationStatus || data.negotiation_status || undefined,
    offered_price: parseFloat(data.offeredTotalPrice || data.offered_price) || undefined,
    agreed_price: parseFloat(data.counterOfferByOwner || data.agreed_price) || undefined,
    negotiation_date: data.meetingDate || data.negotiation_date ? safeDate(data.meetingDate || data.negotiation_date) : undefined,
    meeting_notes: data.remarks || data.meeting_notes || undefined,
    projectId: data.projectId || undefined,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/negotiation-processes/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("updateNegotiationProcess network error:", err);
    return payload;
  }
}

export async function deleteNegotiationProcess(uuid: string) {
  try {
    await fetch(`${API_BASE_URL}/lams/negotiation-processes/${uuid}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/lams");
  } catch (err) {
    console.warn("deleteNegotiationProcess error:", err);
  }
}

// ----------------------------------------------------------------------
// Legal Documents
// ----------------------------------------------------------------------
export async function getLegalDocuments() {
  try {
    const res = await fetch(`${API_BASE_URL}/lams/legal-documents`, {
      cache: "no-store",
      next: { tags: ["lams-legal-documents"] },
    });
    if (!res.ok) {
      console.warn("Backend error fetching legal documents, using mock");
      return mockLegalDocuments;
    }
    const json = await res.json();
    const rawData = json.data !== undefined ? json.data : json;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return mockLegalDocuments;
    }

    return rawData.map((item: any, idx: number) => {
      const idStr = String(item.id || item.uuid || `DOC-${idx + 1}`);
      return {
        id: idStr,
        uuid: idStr,
        acquisitionLeadId: item.lead_id || item.acquisitionLeadId || "",
        leadTitle: item.lead_title || item.leadTitle || "Land Parcel",
        documentType: item.document_type || item.documentType || "Baya Deed",
        documentFileName: item.document_number || item.documentFileName || "deed_document.pdf",
        fileSize: item.file_size || item.fileSize || "2.4 MB",
        verificationStatus: item.verification_status || item.verificationStatus || "Pending",
        verifiedBy: item.verified_by || item.verifiedBy || "Legal Officer",
        verificationDate: item.issue_date
          ? new Date(item.issue_date).toLocaleDateString()
          : item.verificationDate || "",
        remarks: item.vetting_remarks || item.remarks || "",
        projectId: item.projectId || item.project_id,
      };
    });
  } catch (error) {
    console.warn("Network error in getLegalDocuments, using mock fallback:", error);
    return mockLegalDocuments;
  }
}

export async function createLegalDocument(data: any) {
  const payload = {
    lead_id: data.acquisitionLeadId || data.lead_id,
    document_type: data.documentType || data.document_type || "Deed",
    document_number: data.documentFileName || data.document_number || "DOC-DEFAULT",
    issue_date: safeDate(data.verificationDate || data.issue_date),
    file_path: data.file_path || "/uploads/dummy.pdf",
    verification_status: data.verificationStatus || data.verification_status || "Pending",
    vetting_remarks: data.remarks || data.vetting_remarks || "",
    projectId: data.projectId,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/legal-documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("createLegalDocument network error:", err);
    return payload;
  }
}

export async function updateLegalDocument(uuid: string, data: any) {
  const payload: any = {
    lead_id: data.acquisitionLeadId || data.lead_id || undefined,
    verification_status: data.verificationStatus || data.verification_status || undefined,
    document_type: data.documentType || data.document_type || undefined,
    document_number: data.documentFileName || data.document_number || undefined,
    issue_date: data.verificationDate || data.issue_date ? safeDate(data.verificationDate || data.issue_date) : undefined,
    vetting_remarks: data.remarks || data.vetting_remarks || undefined,
    projectId: data.projectId || undefined,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/legal-documents/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("updateLegalDocument network error:", err);
    return payload;
  }
}

export async function deleteLegalDocument(uuid: string) {
  try {
    await fetch(`${API_BASE_URL}/lams/legal-documents/${uuid}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/lams");
  } catch (err) {
    console.warn("deleteLegalDocument error:", err);
  }
}

// ----------------------------------------------------------------------
// Follow Ups
// ----------------------------------------------------------------------
export async function getFollowUps() {
  try {
    const res = await fetch(`${API_BASE_URL}/lams/follow-ups`, {
      cache: "no-store",
      next: { tags: ["lams-follow-ups"] },
    });
    if (!res.ok) {
      console.warn("Backend error fetching follow-ups, using mock");
      return mockFollowUpItems;
    }
    const json = await res.json();
    const rawData = json.data !== undefined ? json.data : json;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return mockFollowUpItems;
    }

    return rawData.map((item: any, idx: number) => {
      const idStr = String(item.id || item.uuid || `FLW-${idx + 1}`);
      return {
        id: idStr,
        uuid: idStr,
        sl: idx + 1,
        acquisitionLeadId: item.lead_id || item.acquisitionLeadId || "",
        date: item.follow_up_date
          ? new Date(item.follow_up_date).toLocaleDateString()
          : item.date || new Date().toLocaleDateString(),
        landDetails: item.land_details || item.landDetails || "Land Parcel",
        ownerDetails: item.owner_details || item.ownerDetails || "Land Owner",
        contact: item.contact || "+880 1711-000000",
        followUpType: item.follow_up_type || item.followUpType || "Call",
        status: (item.outcome === "Interested" || item.status === "Completed"
          ? "Completed"
          : "Pending") as any,
        note: item.remarks || item.note || "",
        assignedTo: item.assigned_to || item.assignedTo || "Sakib Al Hasan",
        projectId: item.projectId || item.project_id,
      };
    });
  } catch (error) {
    console.warn("Network error in getFollowUps, using mock fallback:", error);
    return mockFollowUpItems;
  }
}

export async function createFollowUp(data: any) {
  const payload = {
    lead_id: data.acquisitionLeadId || data.lead_id,
    follow_up_date: safeDate(data.date || data.follow_up_date),
    follow_up_type: data.followUpType || data.follow_up_type || "Call",
    outcome: data.status === "Completed" ? "Interested" : "Pending",
    next_action_date: safeDate(data.next_action_date),
    remarks: data.note || data.remarks || "",
    projectId: data.projectId,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/follow-ups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("createFollowUp network error:", err);
    return payload;
  }
}

export async function updateFollowUp(uuid: string, data: any) {
  const payload: any = {
    lead_id: data.acquisitionLeadId || data.lead_id || undefined,
    outcome: data.status ? (data.status === "Completed" ? "Interested" : "Pending") : undefined,
    follow_up_type: data.followUpType || data.follow_up_type || undefined,
    follow_up_date: data.date ? safeDate(data.date) : undefined,
    remarks: data.note || data.remarks || undefined,
    projectId: data.projectId || undefined,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/lams/follow-ups/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidatePath("/dashboard/lams");
    const json = await res.json().catch(() => null);
    return json?.data || json || payload;
  } catch (err) {
    console.warn("updateFollowUp network error:", err);
    return payload;
  }
}

export async function deleteFollowUp(uuid: string) {
  try {
    await fetch(`${API_BASE_URL}/lams/follow-ups/${uuid}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/lams");
  } catch (err) {
    console.warn("deleteFollowUp error:", err);
  }
}
