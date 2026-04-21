
import { useQuery } from "@tanstack/react-query";

// Types (must match UI expectations)
export type BadgeType = {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
};
export type UserBadge = {
  id: string;
  user_id: string;
  badge_type_id: string;
  assigned_at: string;
  badge_type: BadgeType;
};

// Get all badge types
export const useBadgeTypes = () =>
  useQuery({
    queryKey: ["badge-types"],
    queryFn: async () => [
      {
        id: "bt-1",
        name: "Top Reviewer",
        icon: "⭐️",
        description: "Awarded for leaving great reviews.",
      },
      {
        id: "bt-2",
        name: "Expert",
        icon: "💡",
        description: "Recognized expertise in the community.",
      },
    ] as BadgeType[],
    staleTime: Infinity,
  });

// Get badges for current user
export const useUserBadges = () =>
  useQuery({
    queryKey: ["user-badges", "staticUser"],
    queryFn: async () =>
      [
        {
          id: "ub-1",
          user_id: "staticUser",
          badge_type_id: "bt-1",
          assigned_at: new Date().toISOString(),
          badge_type: {
            id: "bt-1",
            name: "Top Reviewer",
            icon: "⭐️",
            description: "Awarded for leaving great reviews.",
          },
        },
        {
          id: "ub-2",
          user_id: "staticUser",
          badge_type_id: "bt-2",
          assigned_at: new Date().toISOString(),
          badge_type: {
            id: "bt-2",
            name: "Expert",
            icon: "💡",
            description: "Recognized expertise in the community.",
          },
        },
      ] as UserBadge[],
    staleTime: Infinity,
  });

// Membership tier lookup and current user tier
export type MembershipTier = {
  id: string;
  code: string;
  display_label: string;
  description?: string | null;
};

export const useMembershipTiers = () =>
  useQuery({
    queryKey: ["membership-tiers"],
    queryFn: async () => [
      {
        id: "tier-1",
        code: "FREE",
        display_label: "Free",
        description: "Basic membership, limited features.",
      },
      {
        id: "tier-2",
        code: "PREMIUM",
        display_label: "Premium",
        description: "Unlock all premium features.",
      },
    ] as MembershipTier[],
    staleTime: Infinity,
  });

export const useCurrentUserMembershipTier = () =>
  useQuery({
    queryKey: ["my-membership-tier", "staticUser"],
    queryFn: async () =>
      ({
        id: "tier-2",
        code: "PREMIUM",
        display_label: "Premium",
        description: "Unlock all premium features.",
      } as MembershipTier),
    staleTime: Infinity,
  });

