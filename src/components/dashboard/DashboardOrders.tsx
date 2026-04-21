
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function DashboardOrders() {
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
        <h2 className="text-2xl font-bold mb-2 text-primary">My Orders</h2>
        <div className="text-muted-foreground mb-4">
          <b>Check out all your past orders on Networker Today.</b> Review your classifieds, ads, and service purchases here!
        </div>
        {/* Placeholder for order list */}
        <div>
          <span>Coming soon: list of your past orders.</span>
        </div>
      </Card>
    </div>
  );
}
