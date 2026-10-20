import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <AdminSidebar />

      <div className="lg:pl-[250px]">
        <AdminTopbar />

        <main className="min-h-full p-6 sm:p-12 mt-10">{children}</main>
      </div>
    </div>
    </AdminAuthGuard>
  );
}
