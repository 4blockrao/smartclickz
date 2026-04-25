
import React from "react";
import GamifiedOnboardingDashboard from "./GamifiedOnboardingDashboard";
/**
 * This page just wraps the already split-out gamified onboarding UI.
 */
export default function DashboardOnboarding() {
  return (
    <div className="max-w-3xl mx-auto pb-8 px-2 sm:px-0 fade-in">
      <GamifiedOnboardingDashboard />
    </div>
  );
}
