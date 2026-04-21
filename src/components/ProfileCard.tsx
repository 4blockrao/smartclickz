
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { differenceInYears, parseISO, isValid } from "date-fns";
import { Star, BadgeCheck, Badge, BadgeX } from "lucide-react";

type Profile = {
  id: string;
  display_name: string;
  bio: string | null;
  key_skills: string | null;
  profile_image_url: string | null;
  date_of_birth?: string | null;
  networker_type?: string | null; // new
  is_verified?: boolean | null;   // new
  kyc_status?: string | null;     // new
};

function getPrimarySkill(key_skills: string | null) {
  if (!key_skills) return "";
  const arr = key_skills.split(',').map(s => s.trim()).filter(Boolean);
  return arr[0] || "";
}

// Calculate age from birthdate (ISO string)
function getAge(dob?: string | null): number | undefined {
  if (!dob) return undefined;
  try {
    const parsed = parseISO(dob);
    if (!isValid(parsed)) return undefined;
    return differenceInYears(new Date(), parsed);
  } catch {
    return undefined;
  }
}

export default function ProfileCard({ profile, extraActions }: { profile: Profile, extraActions?: React.ReactNode }) {
  const age = getAge(profile.date_of_birth);
  return (
    <Link to={`/profiles/${profile.id}`} className="block group">
      <Card className="hover:shadow-lg transition cursor-pointer group-hover:ring-2 group-hover:ring-primary/30">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden mb-2 relative">
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.display_name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
                {profile.display_name ? profile.display_name.charAt(0) : "?"}
              </div>
            )}
            {/* Premium badge */}
            {profile.networker_type === "premium" && (
              <span title="Premium Networker" className="absolute top-1 left-1">
                <Star className="w-5 h-5 text-yellow-400" fill="#f7c643" />
              </span>
            )}
            {/* Verified */}
            {profile.is_verified && (
              <span title="Verified Profile" className="absolute bottom-1 right-1 bg-green-100 border border-green-500 rounded-full p-1">
                <BadgeCheck className="w-4 h-4 text-green-600" />
              </span>
            )}
            {/* KYC badge */}
            {profile.kyc_status === "approved" && (
              <span title="KYC Approved" className="absolute bottom-1 left-1 bg-blue-100 border border-blue-500 rounded-full p-1">
                <Badge className="w-4 h-4 text-blue-600" />
              </span>
            )}
            {profile.kyc_status === "rejected" && (
              <span title="KYC Rejected" className="absolute bottom-1 left-1 bg-red-100 border border-red-500 rounded-full p-1">
                <BadgeX className="w-4 h-4 text-destructive" />
              </span>
            )}
            {profile.kyc_status === "pending" && (
              <span title="KYC Pending" className="absolute bottom-1 left-1 bg-yellow-100 border border-yellow-500 rounded-full p-1">
                <Badge className="w-4 h-4 text-yellow-500" />
              </span>
            )}
          </div>
          <div className="font-bold text-lg">{profile.display_name}</div>
          {age !== undefined && (
            <div className="text-xs text-primary font-medium">{age} yrs</div>
          )}
          {profile.key_skills && getPrimarySkill(profile.key_skills) && (
            <div className="text-[15px] mt-1 text-primary font-medium">
              {getPrimarySkill(profile.key_skills)}
            </div>
          )}
          {profile.bio && (
            <div className="text-sm text-muted-foreground mt-1 line-clamp-3">
              {profile.bio}
            </div>
          )}
          {extraActions && (
            <div className="mt-2">{extraActions}</div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
