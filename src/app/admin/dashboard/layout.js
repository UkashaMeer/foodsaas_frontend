// app/dashboard/layout.jsx
import { AdminHeader } from "@/components/admin/global/AdminHeader";
import { AdminSidebar } from "@/components/admin/global/AdminSidebar";
import { AdminMobileSidebar } from "@/components/admin/global/AdminMobileSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <AdminMobileSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
