
import { Outlet, RouteObject, useRoutes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import {
  AdminHome,
  AdminUsers,
  AdminPosts,
  AdminComments,
  AdminActivityLog,
} from "./admin/AdminSidebarRoutes";

// New layout for /admin/* routing
export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "users", element: <AdminUsers /> },
      { path: "posts", element: <AdminPosts /> },
      { path: "comments", element: <AdminComments /> },
      { path: "activity", element: <AdminActivityLog /> },
      // TODO: add admin/tasks, admin/roles, etc.
    ],
  },
];

export default function AdminIndex() {
  // Allow react-router v6+ to handle nested routes
  return <Outlet />;
}
