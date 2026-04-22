import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardOnboarding() {
  return (
    <div className="max-w-3xl mx-auto pb-8 px-2 sm:px-0 fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete your onboarding tasks to get started and earn points!</p>
        </CardContent>
      </Card>
    </div>
  );
}
