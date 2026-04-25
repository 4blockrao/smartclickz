
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function DashboardTransactions() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </Button>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-primary">My Transactions</h2>
        <div className="text-muted-foreground mb-4">
          <b>View all your transactions in one place.</b> See all your wallet debits and credits, rewards, and spending!
        </div>
        {/* Placeholder for wallet transaction list */}
        <div>
          <span>Coming soon: full wallet statement.</span>
        </div>
      </Card>
    </div>
  );
}
