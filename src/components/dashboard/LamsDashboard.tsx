"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LamsHeaderNav, LamsTab } from "@/components/lams/LamsHeaderNav";
import { LamsMetrics } from "@/components/lams/LamsMetrics";
import { LandOwnersView } from "@/components/lams/LandOwnersView";
import { AcquisitionLeadsView } from "@/components/lams/AcquisitionLeadsView";
import { NegotiationProcessView } from "@/components/lams/NegotiationProcessView";
import { LegalDocumentsView } from "@/components/lams/LegalDocumentsView";
import { FollowUpView } from "@/components/lams/FollowUpView";

import {
  createLandOwner,
  deleteLandOwner,
  updateLandOwner,
  createAcquisitionLead,
  deleteAcquisitionLead,
  updateAcquisitionLead,
  createNegotiationProcess,
  deleteNegotiationProcess,
  updateNegotiationProcess,
  createLegalDocument,
  deleteLegalDocument,
  updateLegalDocument,
  createFollowUp,
  deleteFollowUp,
  updateFollowUp,
} from "@/app/actions/lams.actions";
import { useTransition } from "react";
import {
  LandOwner,
  AcquisitionLead,
  NegotiationRecord,
  LegalDocument,
  FollowUpItem,
} from "@/types/lams";

const PATH_TO_TAB: Record<string, LamsTab> = {
  "": "owners",
  dashboard: "owners",
  "land-owners": "owners",
  "acquisition-leads": "leads",
  "negotiation-process": "negotiation",
  "legal-documents": "documents",
  "follow-up": "followup",
};

const TAB_TO_PATH: Record<LamsTab, string> = {
  owners: "land-owners",
  leads: "acquisition-leads",
  negotiation: "negotiation-process",
  documents: "legal-documents",
  followup: "follow-up",
};

interface LamsDashboardProps {
  path?: string;
  initialLeads: AcquisitionLead[];
  initialOwners: LandOwner[];
  initialNegotiations: NegotiationRecord[];
  initialDocuments: LegalDocument[];
  initialFollowUps: FollowUpItem[];
}

export default function LamsDashboard({
  path = "",
  initialLeads,
  initialOwners,
  initialNegotiations,
  initialDocuments,
  initialFollowUps,
}: LamsDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Resolve initial tab from route path
  const initialTab = PATH_TO_TAB[path] ?? "owners";
  const [activeTab, setActiveTab] = useState<LamsTab>(initialTab);
  const [showInsights, setShowInsights] = useState(true);

  // Sync state if path prop changes from route navigation
  useEffect(() => {
    if (path && PATH_TO_TAB[path]) {
      setActiveTab(PATH_TO_TAB[path]);
    }
  }, [path]);

  // When tab is clicked in header, sync URL if inside /dashboard/lams
  const handleTabChange = (newTab: LamsTab) => {
    setActiveTab(newTab);
    if (pathname?.startsWith("/dashboard/lams")) {
      const subPath = TAB_TO_PATH[newTab];
      router.push(`/dashboard/lams/${subPath}`);
    }
  };

  // Handlers for Land Owners
  const handleAddOwner = (newOwner: any) => {
    startTransition(async () => {
      await createLandOwner(newOwner);
    });
  };
  const handleEditOwner = (uuid: string, updatedOwner: any) => {
    startTransition(async () => {
      await updateLandOwner(uuid, updatedOwner);
    });
  };
  const handleDeleteOwner = (uuid: string) => {
    startTransition(async () => {
      await deleteLandOwner(uuid);
    });
  };

  // Handlers for Acquisition Leads
  const handleAddLead = (newLead: any) => {
    startTransition(async () => {
      await createAcquisitionLead(newLead);
    });
  };
  const handleEditLead = (uuid: string, updatedLead: any) => {
    startTransition(async () => {
      await updateAcquisitionLead(uuid, updatedLead);
    });
  };
  const handleDeleteLead = (uuid: string) => {
    startTransition(async () => {
      await deleteAcquisitionLead(uuid);
    });
  };

  // Handlers for Negotiations
  const handleAddNegotiation = (newRecord: any) => {
    startTransition(async () => {
      await createNegotiationProcess(newRecord);
    });
  };
  const handleEditNegotiation = (uuid: string, updatedRecord: any) => {
    startTransition(async () => {
      await updateNegotiationProcess(uuid, updatedRecord);
    });
  };
  const handleDeleteNegotiation = (uuid: string) => {
    startTransition(async () => {
      await deleteNegotiationProcess(uuid);
    });
  };

  // Handlers for Legal Documents
  const handleAddDocument = (newDoc: any) => {
    startTransition(async () => {
      await createLegalDocument(newDoc);
    });
  };
  const handleEditDocument = (uuid: string, updatedDoc: any) => {
    startTransition(async () => {
      await updateLegalDocument(uuid, updatedDoc);
    });
  };
  const handleDeleteDocument = (uuid: string) => {
    startTransition(async () => {
      await deleteLegalDocument(uuid);
    });
  };

  // Handlers for Follow Ups
  const handleAddFollowUp = (newItem: any) => {
    startTransition(async () => {
      await createFollowUp(newItem);
    });
  };
  const handleEditFollowUp = (uuid: string, updatedItem: any) => {
    startTransition(async () => {
      await updateFollowUp(uuid, updatedItem);
    });
  };
  const handleDeleteFollowUp = (uuid: string) => {
    startTransition(async () => {
      await deleteFollowUp(uuid);
    });
  };
  const handleToggleCompleteFollowUp = (uuid: string) => {
    const item = initialFollowUps.find((f) => f.uuid === uuid || (f as any).id === uuid);
    if (!item) return;
    const newStatus = item.status === "Completed" ? "Pending" : "Completed";
    startTransition(async () => {
      await updateFollowUp(uuid, { status: newStatus });
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Module Header Navigation Tabs & Breadcrumb */}
      <LamsHeaderNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showInsights={showInsights}
        onToggleInsights={() => setShowInsights((prev) => !prev)}
        counts={{
          owners: initialOwners.length,
          leads: initialLeads.length,
          negotiation: initialNegotiations.length,
          documents: initialDocuments.length,
          followup: initialFollowUps.length,
        }}
      />

      {/* 2. Executive KPI Metric Strip + Collapsible Analytics Chart */}
      <LamsMetrics 
        showInsights={showInsights} 
        leads={initialLeads}
        owners={initialOwners}
        negotiations={initialNegotiations}
        documents={initialDocuments}
        followUps={initialFollowUps}
      />

      {/* 3. Dynamic Module Views */}
      <div className="animate-in fade-in duration-200">
        {activeTab === "owners" && (
          <LandOwnersView
            owners={initialOwners}
            onAddOwner={handleAddOwner}
            onEditOwner={handleEditOwner}
            onDeleteOwner={handleDeleteOwner}
            acquisitionLeads={initialLeads}
          />
        )}

        {activeTab === "leads" && (
          <AcquisitionLeadsView
            leads={initialLeads}
            onAddLead={handleAddLead}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
          />
        )}

        {activeTab === "negotiation" && (
          <NegotiationProcessView
            negotiations={initialNegotiations}
            onAddNegotiation={handleAddNegotiation}
            onEditNegotiation={handleEditNegotiation}
            onDeleteNegotiation={handleDeleteNegotiation}
            acquisitionLeads={initialLeads}
          />
        )}

        {activeTab === "documents" && (
          <LegalDocumentsView
            documents={initialDocuments}
            onAddDocument={handleAddDocument}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            acquisitionLeads={initialLeads}
          />
        )}

        {activeTab === "followup" && (
          <FollowUpView
            followUps={initialFollowUps}
            onAddFollowUp={handleAddFollowUp}
            onEditFollowUp={handleEditFollowUp}
            onDeleteFollowUp={handleDeleteFollowUp}
            onToggleComplete={handleToggleCompleteFollowUp}
            acquisitionLeads={initialLeads}
          />
        )}
      </div>
    </div>
  );
}
