
import React from "react";
import { useUserBadges } from "@/hooks/useBadges";
import { Badge } from "@/components/ui/badge";

// Component to display user's badges (icon + label)
const UserBadges = () => {
  const { data: badges, isLoading } = useUserBadges();

  if (isLoading) {
    return <div>Loading badges…</div>;
  }
  if (!badges || badges.length === 0) {
    return <div className="text-muted-foreground text-sm">No badges yet.</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <Badge
          key={badge.id}
          variant="secondary"
          title={badge.badge_type.description || badge.badge_type.name}
        >
          {badge.badge_type.icon && (
            <span className="mr-1" aria-hidden>
              {/* supports emoji or icon code */}
              {badge.badge_type.icon}
            </span>
          )}
          {badge.badge_type.name}
        </Badge>
      ))}
    </div>
  );
};

export default UserBadges;
