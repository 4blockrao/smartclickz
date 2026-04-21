
import React from "react";
import { useCurrentUserMembershipTier } from "@/hooks/useBadges";

const MembershipTierDisplay = () => {
  const { data: tier, isLoading } = useCurrentUserMembershipTier();

  if (isLoading) {
    return <span>Loading membership…</span>;
  }
  if (!tier) {
    return <span className="text-sm text-muted-foreground">No membership tier</span>;
  }
  return (
    <div className="mb-2">
      <span className="font-semibold">Membership: </span>
      <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary font-medium mr-2">
        {tier.display_label}
      </span>
      {tier.description && (
        <span className="text-xs ml-2 text-muted-foreground">{tier.description}</span>
      )}
    </div>
  );
};

export default MembershipTierDisplay;
