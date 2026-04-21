
import React from "react";
import { Button } from "@/components/ui/button";
import { useServicePointCost } from "@/hooks/useServicePricing";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 * - serviceName: string ('submit_press_release', 'submit_news_article', etc)
 * - label: string (e.g. "Submit a Press Release")
 * - icon: ReactNode
 * - userPoints: number
 */
export function ServiceActionCTA({
  serviceName,
  label,
  icon,
  userPoints,
  to,
}: {
  serviceName: string;
  label: string;
  icon?: React.ReactNode;
  userPoints: number;
  to: string;
}) {
  const { pointCost, isLoading } = useServicePointCost(serviceName);
  const navigate = useNavigate();

  const hasEnough = pointCost !== null && userPoints >= pointCost;

  return (
    <div className="flex flex-col items-center border rounded-xl p-6 shadow bg-white w-full max-w-xs">
      <div className="w-12 h-12 flex items-center justify-center mb-2 text-primary text-3xl">
        {icon ?? "★"}
      </div>
      <div className="font-bold text-lg mb-1">{label}</div>
      <div className="text-sm text-muted-foreground mb-3">
        {isLoading
          ? "Loading…"
          : pointCost !== null
            ? `Cost: ${pointCost} pts`
            : "Unavailable"}
      </div>
      <Button
        disabled={isLoading || pointCost === null || !hasEnough}
        onClick={() => navigate(to)}
        className="w-full"
        variant={hasEnough ? "default" : "outline"}
      >
        {hasEnough ? "Submit" : "Insufficient Points"}
      </Button>
      {!hasEnough && pointCost !== null && (
        <div className="text-xs mt-2 text-destructive text-center">
          You do not have enough points to use this service.
        </div>
      )}
    </div>
  );
}
