
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { User, Star, BadgeCheck, Badge, BadgeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function DashboardProfileCard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch profile to check statuses
  const { data: profile } = useQuery({
    queryKey: ["dashboard-profile-badges", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, is_verified, networker_type, kyc_status")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  // CTA display logic
  const needsVerification = !!profile && !profile.is_verified;
  const needsPremium = !!profile && profile.networker_type !== "premium";
  const needsKYC = !!profile && profile.kyc_status !== "approved";

  return (
    <Card className="p-5 bg-gradient-to-bl from-white to-[#f3f7fe]/70 shadow-xl flex flex-col items-center">
      <div className="rounded-full bg-muted w-20 h-20 mb-2 flex items-center justify-center relative">
        <User className="w-10 h-10 text-primary" />
        {profile?.is_verified && (
          <span title="Verified Profile" className="absolute bottom-1 right-1 bg-green-100 border border-green-500 rounded-full p-1">
            <BadgeCheck className="w-4 h-4 text-green-600" />
          </span>
        )}
        {profile?.networker_type === "premium" && (
          <span title="Premium Networker" className="absolute top-1 left-1">
            <Star className="w-5 h-5 text-yellow-400" fill="#f7c643" />
          </span>
        )}
        {profile?.kyc_status === "approved" && (
          <span title="KYC Approved" className="absolute bottom-1 left-1 bg-blue-100 border border-blue-500 rounded-full p-1">
            <Badge className="w-4 h-4 text-blue-600" />
          </span>
        )}
        {profile?.kyc_status === "rejected" && (
          <span title="KYC Rejected" className="absolute bottom-1 left-1 bg-red-100 border border-red-500 rounded-full p-1">
            <BadgeX className="w-4 h-4 text-destructive" />
          </span>
        )}
        {profile?.kyc_status === "pending" && (
          <span title="KYC Pending" className="absolute bottom-1 left-1 bg-yellow-100 border border-yellow-500 rounded-full p-1">
            <Badge className="w-4 h-4 text-yellow-500" />
          </span>
        )}
      </div>
      <div className="font-bold text-xl">{user?.email || "Your Name"}</div>
      <div className="text-xs text-muted-foreground">View or edit your profile info</div>
      <Button variant="outline" className="mt-2 mb-1" asChild>
        <a href="/profile/edit">Edit</a>
      </Button>
      {/* Show status CTAs */}
      <div className="w-full mt-2 flex flex-col items-center gap-2">
        {needsVerification && (
          <Button
            size="sm"
            className="w-full bg-green-100 text-green-800 border-green-200 font-semibold"
            variant="outline"
            onClick={() => navigate("/profile/edit")}
          >
            <BadgeCheck className="w-4 h-4 mr-1 text-green-600" />
            Get Verified
          </Button>
        )}
        {needsPremium && (
          <Button
            size="sm"
            className="w-full bg-yellow-100 text-yellow-900 border-yellow-200 font-semibold"
            variant="outline"
            onClick={() => navigate("/profile/edit")}
          >
            <Star className="w-4 h-4 mr-1 text-yellow-500" fill="#f7c643" />
            Get Premium
          </Button>
        )}
        {needsKYC && (
          <Button
            size="sm"
            className="w-full bg-blue-100 text-blue-900 border-blue-200 font-semibold"
            variant="outline"
            onClick={() => navigate("/profile/edit")}
          >
            <Badge className="w-4 h-4 mr-1 text-blue-600" />
            Complete KYC
          </Button>
        )}
      </div>
    </Card>
  );
}
