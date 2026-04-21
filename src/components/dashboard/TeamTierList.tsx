
import React from "react";
import { User, MessageCircle, Star, BadgeCheck, BadgeX, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";

// Extend ReferralUser to provide new status fields
export type ReferralUser = {
  user_id: string;
  referred_at: string;
  status: "activated" | "pending";
  display_name?: string | null;
  referral_user_id?: string | null;
  phone?: string | null;
  networker_type?: string | null;
  is_verified?: boolean | null;
  kyc_status?: string | null;
};

export interface TeamTierListProps {
  tiers: {
    level: number;
    users: ReferralUser[];
  }[];
}

const getWhatsAppUrl = (phone: string, teammate: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(teammate)},%20let's%20connect%20on%20the%20platform!`;

export const TeamTierList: React.FC<TeamTierListProps> = ({ tiers }) => {
  if (!tiers?.length) {
    return <div className="text-muted-foreground">No team members yet.</div>;
  }
  return (
    <div className="space-y-5">
      {tiers.map(({ level, users }) => (
        <div key={level}>
          <div className="font-semibold text-md mb-2">
            Level {level} {level === 1 && "(Direct referrals)"}
          </div>
          <ul className="ml-4 flex flex-col gap-2">
            {users.map((user) => (
              <li key={user.user_id} className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                <span className="font-mono">{user.display_name || user.referral_user_id || user.user_id.slice(0,8) + "…"}</span>
                {/* STATUS BADGES */}
                {user.networker_type === "premium" && (
                  <span title="Premium Networker" className="flex items-center px-1">
                    <Star className="w-4 h-4 text-yellow-500" fill="#f7c643" />
                  </span>
                )}
                {user.is_verified && (
                  <span title="Verified" className="flex items-center">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                  </span>
                )}
                {/* KYC Badge */}
                {user.kyc_status === "approved" && (
                  <span title="KYC Approved" className="flex items-center">
                    <Badge className="w-4 h-4 text-blue-500" />
                  </span>
                )}
                {user.kyc_status === "pending" && (
                  <span title="KYC Pending" className="flex items-center">
                    <Badge className="w-4 h-4 text-yellow-500" />
                  </span>
                )}
                {user.kyc_status === "rejected" && (
                  <span title="KYC Rejected" className="flex items-center">
                    <BadgeX className="w-4 h-4 text-destructive" />
                  </span>
                )}
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                  user.status === "activated"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                }`}>
                  {user.status === "activated" ? "Activated" : "Pending"}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">(joined {new Date(user.referred_at).toLocaleDateString()})</span>
                {/* ONLY for level 1: WhatsApp button if phone is present */}
                {level === 1 && (
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="ml-3"
                    disabled={!user.phone}
                    title={user.phone ? "Connect via WhatsApp" : "Phone not available"}
                  >
                    {user.phone ? (
                      <a
                        href={getWhatsAppUrl(user.phone, user.display_name || user.referral_user_id || "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        WhatsApp
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 opacity-40">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </span>
                    )}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
