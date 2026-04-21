
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardOrdersCard() {
  // Placeholder
  return (
    <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl flex flex-col items-center">
      <FileText className="w-8 h-8 text-orange-500 mb-2" />
      <div className="font-bold text-lg">Orders</div>
      <div className="text-xl mt-2">3</div>
      <div className="text-xs text-muted-foreground">Recent orders</div>
      <Button variant="secondary" size="sm" className="mt-4" asChild>
        <a href="/dashboard/orders">My Orders</a>
      </Button>
    </Card>
  );
}
