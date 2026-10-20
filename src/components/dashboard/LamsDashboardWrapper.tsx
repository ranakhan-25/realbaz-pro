import LamsDashboard from "./LamsDashboard";
import {
  getAcquisitionLeads,
  getLandOwners,
  getNegotiationProcesses,
  getLegalDocuments,
  getFollowUps,
} from "@/app/actions/lams.actions";

export default async function LamsDashboardWrapper({ path }: { path: string }) {
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

  const leads = leadsResponse.status === "fulfilled" && Array.isArray(leadsResponse.value) ? leadsResponse.value : [];
  const owners = ownersResponse.status === "fulfilled" && Array.isArray(ownersResponse.value) ? ownersResponse.value : [];
  const negotiations = negotiationsResponse.status === "fulfilled" && Array.isArray(negotiationsResponse.value) ? negotiationsResponse.value : [];
  const documents = documentsResponse.status === "fulfilled" && Array.isArray(documentsResponse.value) ? documentsResponse.value : [];
  const followUps = followUpsResponse.status === "fulfilled" && Array.isArray(followUpsResponse.value) ? followUpsResponse.value : [];

  return (
    <LamsDashboard
      path={path}
      initialLeads={leads}
      initialOwners={owners}
      initialNegotiations={negotiations}
      initialDocuments={documents}
      initialFollowUps={followUps}
    />
  );
}
