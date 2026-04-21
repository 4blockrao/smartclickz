import React from "react";
import {
  BadgeCheck,
  User,
  QrCode,
  Verified,
  CalendarCheck,
  Users,
  Briefcase,
  Crown,
  DollarSign,
  ListCheck,
  Flame,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProfileQRCode } from "./ProfileQRCode";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useProfileFollow } from "@/hooks/useProfileFollow";
import { supabase } from "@/integrations/supabase/client";
import FollowersList from "./FollowersList";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Updated type: Add user_id as required
type PowerProfileCardProps = {
  profile: {
    display_name: string;
    user_id: string; // Required!
    city?: string | null;
    country?: string | null;
    bio?: string | null;
    profile_image_url?: string | null;
    is_verified?: boolean;
    expertise?: string | null;
    company?: string | null;
    role?: string | null;
    start_date?: string | null;
    achievement_badge?: string | null;
  };
  qrUrl: string;
  networkerScore: number;
  teamStats: { level1: number; level2: number; teamTotal: number; };
  achievements: { earnings: number; referrals: number; tasks: number; streak?: string; badgeUrl?: string; };
  onJoinMyTeam: () => void;
  onFollow: () => void;
  onContact: () => void;
  onBookCall: () => void;
};

function formatNumber(n: number) {
  return n.toLocaleString();
}

export const PowerProfileCard: React.FC<PowerProfileCardProps & { profileUrl: string }> = ({
  profile,
  qrUrl,
  networkerScore,
  teamStats,
  achievements,
  onJoinMyTeam,
  onFollow,
  onContact,
  onBookCall,
  profileUrl,
}) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = user?.id === profile.user_id;

  // Follow logic
  const { isFollowing, loading: followLoading, follow, unfollow } = useProfileFollow(profile.user_id);

  // Show follower list modal on click (mobile first UX)
  const [showFollowers, setShowFollowers] = React.useState(false);
  const [followersCount, setFollowersCount] = React.useState<number>(0);

  React.useEffect(() => {
    // Fetch follower count for badge
    async function getFollowersCount() {
      const { count } = await supabase
        .from("profile_followers")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profile.user_id);
      setFollowersCount(count ?? 0);
    }
    getFollowersCount();
  }, [profile.user_id, isFollowing]);

  // Removed message functionality - use social links instead

  // Logic for CTAs
  function handleJoinTeam() {
    if (!user) return toast({ title: "Please login to join a team." });
    toast({ title: "Request sent!", description: "You've requested to join this team." });
  }
  function handleCopyProfileLink() {
    navigator.clipboard.writeText(profileUrl).then(() =>
      toast({ description: "Profile link copied to clipboard!" })
    );
  }

  return (
    <Card className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[#e3e8f0] shadow-lg bg-white">
      {/* Header */}
      <div className="flex flex-row flex-wrap items-start justify-between p-5 bg-gradient-to-br from-[#23324C] to-[#1A1F2C] text-white">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white w-20 h-20 overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt={profile.display_name} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted text-primary">
                  <User className="w-16 h-16" />
                </div>
              )}
              {(profile.is_verified || profile.achievement_badge) && (
                <span className="absolute top-0 left-0 m-1 bg-yellow-300 rounded-full p-1 shadow">
                  {profile.achievement_badge && (
                    <span title="Premium">
                      <svg width="18" height="18" fill="#FFD700" style={{display: 'inline-block'}}><circle cx="9" cy="9" r="9"/></svg>
                    </span>
                  )}
                  {profile.is_verified && (
                    <BadgeCheck className="text-blue-600 w-4 h-4 inline-block ml-1" />
                  )}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl mb-1 flex items-center gap-2">
                {profile.display_name}
                {profile.is_verified && <BadgeCheck className="w-5 h-5 text-[#FFD700] ml-1" />}
                {profile.achievement_badge && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">Premium</span>
                )}
                {/* Show followers badge */}
                <button
                  className="ml-3 text-xs rounded-full px-2 py-0.5 bg-white/30 border border-white/50"
                  onClick={() => setShowFollowers(true)}
                  aria-haspopup="dialog"
                  aria-controls="followers-dialog"
                >{followersCount} Followers</button>
              </h1>
              {/* Followers List modal: Updated to use dialog component */}
              <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
                <DialogContent id="followers-dialog" aria-label="Followers List">
                  <DialogTitle>Followers</DialogTitle>
                  <DialogDescription>
                    View all users following this networker. Tap a user to view their profile and follow back if you wish!
                  </DialogDescription>
                  <FollowersList profileId={profile.user_id} />
                  <Button className="mt-4 w-full" onClick={() => setShowFollowers(false)}>Close</Button>
                </DialogContent>
              </Dialog>
              {(profile.city || profile.country) && (
                <div className="text-sm opacity-80 leading-tight">
                  {(profile.city || "") + (profile.city && profile.country ? ", " : "") + (profile.country || "")}
                </div>
              )}
              {profile.bio && (
                <div className="text-xs opacity-90 mt-1">{profile.bio}</div>
              )}
            </div>
          </div>
          {profile.company && (
            <div className="text-primary-200 font-semibold text-xs mt-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {profile.company}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="rounded bg-white p-2 shadow border w-fit">
            <ProfileQRCode profileUrl={profileUrl} displayName={profile.display_name} size={144} foreground="#1A1F2C" background="#FFF" />
            <Button variant="ghost" size="sm" className="mt-1 text-[12px]" onClick={handleCopyProfileLink}>
              Copy Profile Link
            </Button>
          </div>
        </div>
      </div>
      {/* 2 Cols grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white">
        {/* Left / Professional Info + Achievements */}
        <div className="p-5 border-r border-[#e3e8f0] flex flex-col gap-4 min-h-[270px]">
          <div>
            <div className="font-semibold bg-[#23324C] text-white px-3 py-1 rounded text-xs tracking-wider mb-2 w-fit">PROFESSIONAL INFO</div>
            <ul className="mt-1 space-y-2 text-[#1A1F2C] font-medium text-sm">
              <li className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-[#0583F2]" /> {profile.is_verified ? "Verified Networker" : "Unverified"}
              </li>
              <li className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-400" /> {profile.company || <span className="opacity-50">Company N/A</span>}
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gray-400" /> {profile.role || <span className="opacity-50">Role N/A</span>}
              </li>
              <li className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-gray-400" /> {profile.start_date ? `Member: ${profile.start_date}` : <span className="opacity-50">Joined N/A</span>}
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold bg-[#23324C] text-white px-3 py-1 rounded text-xs tracking-wider mb-2 w-fit">ACHIEVEMENTS</div>
            <ul className="space-y-2 text-[#1A1F2C] font-medium text-sm">
              <li className="flex justify-between"><span>Total Earnings</span> <span className="font-bold"><DollarSign className="inline w-4 h-4 mb-0.5" />{achievements.earnings ?? <span className="opacity-50">-</span>}</span></li>
              <li className="flex justify-between"><span>Total Referrals</span> <span className="font-bold"><Users className="inline w-4 h-4 mb-0.5" />{achievements.referrals ?? <span className="opacity-50">-</span>}</span></li>
              <li className="flex justify-between"><span>Tasks Completed</span> <span className="font-bold"><ListCheck className="inline w-4 h-4 mb-0.5" />{achievements.tasks ?? <span className="opacity-50">-</span>}</span></li>
              <li className="flex justify-between"><span>Streak</span> <span className="font-bold"><Flame className="inline w-4 h-4 mb-0.5" />{achievements.streak ?? <span className="opacity-50">-</span>}</span></li>
            </ul>
            {achievements.badgeUrl && (
              <div className="flex mt-3 justify-center">
                <img src={achievements.badgeUrl} alt="Top Recruiter Badge" className="w-20 h-20" />
              </div>
            )}
          </div>
        </div>
        {/* Right / Score + Team Stats */}
        <div className="p-5 flex flex-col gap-4 min-h-[270px]">
          <div>
            <div className="font-semibold bg-[#23324C] text-white px-3 py-1 rounded text-xs tracking-wider mb-2 w-fit">RANK</div>
            <div className="text-[#1A1F2C] text-sm mb-1">Networker Score</div>
            <div className="font-extrabold text-3xl mb-1">{networkerScore ?? <span className="opacity-50">-</span>}</div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#23324C]" style={{ width: `${Math.min(100, (networkerScore ?? 0) / 12)}%` }} />
            </div>
          </div>
          <div>
            <div className="font-semibold bg-[#23324C] text-white px-3 py-1 rounded text-xs tracking-wider mb-2 w-fit">TEAM</div>
            <ul className="space-y-1 text-[#1A1F2C] font-medium text-sm">
              <li className="flex justify-between"><span>Level 1</span> <span className="font-bold">{teamStats.level1 ?? <span className="opacity-50">-</span>}</span></li>
              <li className="flex justify-between"><span>Total 2</span> <span className="font-bold">{teamStats.level2 ?? <span className="opacity-50">-</span>}</span></li>
              <li className="flex justify-between"><span>Total Team</span> <span className="font-bold">{teamStats.teamTotal ?? <span className="opacity-50">-</span>}</span></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Four CTA buttons (updated logic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#23324C] py-4 px-5">
        <Button
          variant="secondary"
          className="w-full py-2 text-lg font-bold uppercase"
          onClick={handleJoinTeam}
          disabled={authLoading || isOwnProfile}
        >
          <Users className="w-5 h-5 mr-2" /> Join My Team
        </Button>
        <Button
          variant={isFollowing ? "outline" : "secondary"}
          className="w-full py-2 text-lg font-bold uppercase"
          onClick={isFollowing ? unfollow : follow}
          disabled={authLoading || followLoading || isOwnProfile}
        >
          <span className="mr-2"><User className="w-5 h-5" /></span>
          {isOwnProfile
            ? "This is You"
            : followLoading
              ? "Please wait…"
              : isFollowing ? "Unfollow" : "Follow Me"}
        </Button>
        {/* Message functionality removed - use social links */}
        <Button
          variant="secondary"
          className="w-full py-2 text-lg font-bold uppercase"
          onClick={() => { /* Future: View network logic */ }}
          disabled={authLoading}
        >
          <span className="mr-2"><Users className="w-5 h-5" /></span> View My Network
        </Button>
      </div>
    </Card>
  );
};
