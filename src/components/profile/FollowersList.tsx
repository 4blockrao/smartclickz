import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { User, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type Profile = {
  id: string;
  display_name: string;
  profile_image_url: string | null;
};

export default function FollowersList({ profileId }: { profileId: string }) {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  // Load followers and check who is followed by me
  useEffect(() => {
    async function loadFollowers() {
      setLoading(true);
      // Get follower profile ids
      const { data: relations, error: relErr } = await supabase
        .from("profile_followers")
        .select("follower_id")
        .eq("following_id", profileId);
      if (relErr) {
        toast({ variant: "destructive", title: "Error loading followers", description: relErr.message });
        setLoading(false);
        return;
      }
      const ids = (relations || []).map(rel => rel.follower_id);
      if (!ids.length) {
        setFollowers([]);
        setFollowingIds([]);
        setLoading(false);
        return;
      }
      // Get full profiles
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("id, display_name, profile_image_url")
        .in("id", ids);
      if (profErr) {
        toast({ variant: "destructive", title: "Error loading followers", description: profErr.message });
        setLoading(false);
        return;
      }
      setFollowers(profiles || []);

      // Check if the current user is already following these followers
      if (user?.id && profiles?.length) {
        const { data: following, error: followErr } = await supabase
          .from("profile_followers")
          .select("following_id")
          .eq("follower_id", user.id)
          .in("following_id", profiles.map(p => p.id));
        if (!followErr && following) {
          setFollowingIds(following.map(f => f.following_id));
        } else {
          setFollowingIds([]);
        }
      } else {
        setFollowingIds([]);
      }
      setLoading(false);
    }
    loadFollowers();
  }, [profileId, user?.id]);

  // Follow-back logic
  const handleFollowBack = async (followerId: string) => {
    if (!user?.id) return;
    if (user.id === followerId) return;
    setFollowLoading(followerId);

    // Pre-check if already following to avoid 409 Conflict
    const alreadyFollowing = followingIds.includes(followerId);

    if (alreadyFollowing) {
      setFollowLoading(null);
      toast({ title: "Already following", description: "You are already following this user." });
      return;
    }

    // Optimistically update UI
    setFollowingIds(prev => [...prev, followerId]);

    const { error } = await supabase
      .from("profile_followers")
      .insert({ follower_id: user.id, following_id: followerId });

    setFollowLoading(null);

    if (error) {
      // If error is unique violation (409 Conflict or duplicate), roll back
      setFollowingIds(prev => prev.filter(id => id !== followerId));
      // Supabase unique violation (409) throws code: "23505"
      // Optionally check "duplicate" in message if need extra protection
      if (
        (error.code === "23505" || error.message.toLowerCase().includes("duplicate"))
        // Removed: || error.status === 409
      ) {
        toast({ title: "Already following", description: "You are already following this user." });
      } else if (error.code === "42501" || error.message.includes("policy")) {
        toast({ variant: "destructive", title: "Permission denied", description: "You are not allowed to follow this user. Please log in first." });
      } else {
        toast({ variant: "destructive", title: "Unable to follow back", description: error.message });
      }
    } else {
      toast({ title: "Now following", description: "You followed this user." });
      setFollowingIds(prev => Array.from(new Set([...prev, followerId])));
    }
  };

  if (loading) return <div>Loading followers…</div>;
  if (!followers.length) return <div className="text-xs text-muted-foreground py-2">No followers yet.</div>;

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {followers.map(f => (
          <li key={f.id} className="flex items-center gap-2 border p-2 rounded bg-muted w-full">
            <Link to={`/profiles/${f.id}`} className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative">
                {f.profile_image_url ? (
                  <img src={f.profile_image_url} alt={f.display_name} className="w-8 h-8 rounded-full object-cover" />
                ) : <User className="w-7 h-7 text-muted-foreground" />}
              </div>
              <span className="truncate font-medium">{f.display_name}</span>
            </Link>
            {/* Follow back button, only if not current user */}
            {user?.id !== f.id && (
              followingIds.includes(f.id) ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 text-primary/80 border-primary/50"
                  disabled
                >
                  <Check className="w-4 h-4 mr-1 text-green-500" /> Following
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleFollowBack(f.id)}
                  disabled={followLoading === f.id}
                  aria-busy={followLoading === f.id}
                >
                  {followLoading === f.id ? "Please wait…" : "Follow Back"}
                </Button>
              )
            )}
          </li>
        ))}
      </ul>
      {/* RLS doc comment */}
      {/* Ensure RLS is enabled & policies match Supabase best practices as above */}
    </div>
  );
}
