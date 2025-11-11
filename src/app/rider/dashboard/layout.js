import RiderHeader from "@/components/rider/RiderHeader";
import RiderSidebar from "@/components/rider/RiderSidebar";

export default function RiderDashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <RiderSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <RiderHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
