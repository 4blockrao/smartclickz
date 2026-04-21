
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

// Add follow notifications via supabase realtime
export function useProfileFollow(profileId: string | null | undefined) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // Check if logged-in user is following the profile
  useEffect(() => {
    const fetchFollowState = async () => {
      if (!user?.id || !profileId || user.id === profileId) return setIsFollowing(false);
      const { data } = await supabase
        .from("profile_followers")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", profileId)
        .maybeSingle();
      setIsFollowing(!!data);
    };
    fetchFollowState();
  }, [user?.id, profileId]);

  // Sub to new followers (notifications)
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel("follow-notify-" + user.id)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profile_followers", filter: `following_id=eq.${user.id}` },
        async (payload) => {
          // Someone has followed you!
          const { follower_id } = payload.new;
          // Get their profile
          const { data: follower } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", follower_id)
            .maybeSingle();
          toast({
            title: "New Follower",
            description: `${follower?.display_name || "A user"} started following you!`,
          });
        }
      )
      .subscribe();
    return () => void supabase.removeChannel(channel);
  }, [user?.id]);

  // Follow a profile
  async function follow() {
    if (!user?.id || !profileId || user.id === profileId) return;
    setLoading(true);
    const { error } = await supabase
      .from("profile_followers")
      .insert({ follower_id: user.id, following_id: profileId });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Unable to follow", description: error.message });
      return;
    }
    setIsFollowing(true);
    toast({ title: "Now following", description: "You are now following this networker." });
    // Optionally: notify the followed user here (future: use supabase edge function)
  }

  // Unfollow
  async function unfollow() {
    if (!user?.id || !profileId) return;
    setLoading(true);
    await supabase
      .from("profile_followers")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", profileId);
    setLoading(false);
    setIsFollowing(false);
    toast({ title: "Unfollowed" });
  }

  return { isFollowing, loading, follow, unfollow };
}

