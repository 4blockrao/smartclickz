
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";

export default function DashboardSettings() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "p-4" : "max-w-2xl mx-auto px-4 py-8"}>
      {!isMobile && (
        <Button
          variant="outline"
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      )}
      
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-primary">Settings</h2>
        <div className="text-muted-foreground mb-4">
          <b>Manage your account settings and preferences.</b> Configure your SmartClicks experience here!
        </div>
        {/* Placeholder for settings content */}
        <div>
          <span>Coming soon: Account settings and preferences.</span>
        </div>
      </Card>
    </div>
  );
}
