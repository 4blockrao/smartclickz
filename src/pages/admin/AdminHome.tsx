
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const sections = [
  { path: "/admin/campaigns", label: "Campaigns" },
  { path: "/admin/clients", label: "Advertisers" },
  { path: "/admin/tasks", label: "Tasks" },
  { path: "/admin/withdrawals", label: "Withdrawals" },
  { path: "/admin/subscriptions", label: "Subscriptions & Comp Plan" },
  { path: "/admin/ledger", label: "Ledger" },
  { path: "/admin/pro-upgrades", label: "Pro Upgrades" },
  { path: "/admin/roles", label: "User Roles" },
];

export default function AdminHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-muted-foreground">
        Welcome! Use the links below to manage all site resources.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sections.map(section => (
          <Link
            to={section.path}
            key={section.label}
            className="block group"
            style={{ textDecoration: "none" }}
          >
            <Card className="hover:shadow-lg hover:ring-2 ring-primary transition group-hover:scale-[1.01]">
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <span>Manage {section.label.toLowerCase()}.</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
