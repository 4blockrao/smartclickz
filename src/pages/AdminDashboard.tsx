import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Admin portal layout. Role-gating is handled by <RequireAdmin> in App.tsx.
 * Renders the admin sidebar + the active admin sub-page via <Outlet />.
 */
export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
