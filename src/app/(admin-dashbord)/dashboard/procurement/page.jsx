import ProcurementDashboard from "@/components/procurement/ProcurementDashboard";

export default function ProcurementPage() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="flex-1 min-w-0">
        <ProcurementDashboard />
      </div>
    </div>
  );
}