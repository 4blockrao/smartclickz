import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Share2, UserCircle, Edit3 } from "lucide-react";
import { ProfileQRCode } from "./ProfileQRCode";

// Define a more specific Profile type for this component's props
// It should match the structure of the 'profile' object passed from ProfileDetail
interface ProfileForHeader {
  id: string; // Profile's primary key
  user_id: string; // User ID associated with this profile
  display_name: string;
  expertise: string | null;
  profile_image_url: string | null;
  // is_verified: boolean | null; // Add if/when available
}

interface ProfileHeaderCardProps {
  profile: ProfileForHeader;
  onApplyVerification: () => void;
  onCopyLink: () => void;
  isOwnProfile?: boolean; // New prop
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps & { profileUrl: string }> = ({
  profile,
  onApplyVerification,
  onCopyLink,
  isOwnProfile,
  profileUrl,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/30" />
        <div className="flex flex-col items-center -mt-16 sm:-mt-20 p-6">
          <div className="relative">
            <div className="rounded-full bg-background w-28 h-28 sm:w-32 sm:h-32 mb-3 overflow-hidden border-4 border-background shadow-lg">
              {profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.display_name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-primary">
                  <UserCircle className="w-20 h-20 sm:w-24 sm:h-24" />
                </div>
              )}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-center">{profile.display_name}</h1>
          {profile.expertise && (
            <p className="text-primary font-medium text-center">{profile.expertise}</p>
          )}
          {/* QR Code & Share */}
          <div className="mt-4 mb-2">
            <ProfileQRCode profileUrl={profileUrl} displayName={profile.display_name} />
          </div>
          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-2">
            {isOwnProfile && (
              <>
                <Button variant="default" size="sm" onClick={onApplyVerification}>
                  <BadgeCheck className="w-4 h-4 mr-2" />
                  Apply for Verification
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile/edit">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={onCopyLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile Link
            </Button>
            <Button variant="secondary" size="sm">
              Follow Me
            </Button>
            <Button variant="default" size="sm">
              Join My Team
            </Button>
            <Button variant="outline" size="sm">
              Contact Me
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
