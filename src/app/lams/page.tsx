import LamsDashboard from "@/components/dashboard/LamsDashboard";
import {
  getAcquisitionLeads,
  getLandOwners,
  getNegotiationProcesses,
  getLegalDocuments,
  getFollowUps,
} from "@/app/actions/lams.actions";

export default async function LamsDashboardPage() {
  // Fetch all data in parallel
  const [
    leadsResponse,
    ownersResponse,
    negotiationsResponse,
    documentsResponse,
    followUpsResponse,
  ] = await Promise.allSettled([
    getAcquisitionLeads(),
    getLandOwners(),
    getNegotiationProcesses(),
    getLegalDocuments(),
    getFollowUps(),
  ]);

  const leads = leadsResponse.status === "fulfilled" ? leadsResponse.value : [];
  const owners = ownersResponse.status === "fulfilled" ? ownersResponse.value : [];
  const negotiations = negotiationsResponse.status === "fulfilled" ? negotiationsResponse.value : [];
  const documents = documentsResponse.status === "fulfilled" ? documentsResponse.value : [];
  const followUps = followUpsResponse.status === "fulfilled" ? followUpsResponse.value : [];

  return (
    <LamsDashboard
      initialLeads={leads}
      initialOwners={owners}
      initialNegotiations={negotiations}
      initialDocuments={documents}
      initialFollowUps={followUps}
    />
  );
}
