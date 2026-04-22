import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const sb = supabase as any;

export type SocialPlatform = "facebook" | "instagram" | "twitter" | "tiktok" | "youtube" | "linkedin";

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  username: string;
  profile_url: string;
  follower_count: number | null;
  verification_status: "pending" | "verified" | "rejected";
  verified_at: string | null;
  last_updated: string;
  created_at: string;
}

export function useSocialAccounts(userId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["social-accounts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await sb
        .from("social_accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as SocialAccount[];
    },
    enabled: !!userId,
  });

  const addAccount = useMutation({
    mutationFn: async (accountData: {
      platform: SocialPlatform; username: string; profile_url: string; follower_count?: number;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      const { data, error } = await sb
        .from("social_accounts")
        .insert({ user_id: userId, ...accountData, verification_status: "pending" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts", userId] });
      toast({ title: "Account Added", description: "Your social account has been added and is pending verification." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to add social account", variant: "destructive" });
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pick<SocialAccount, "username" | "profile_url" | "follower_count">> }) => {
      const { data, error } = await sb
        .from("social_accounts")
        .update({ ...updates, last_updated: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId!)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts", userId] });
      toast({ title: "Account Updated", description: "Your social account has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update social account", variant: "destructive" });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("social_accounts").delete().eq("id", id).eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts", userId] });
      toast({ title: "Account Removed", description: "Your social account has been removed." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to remove social account", variant: "destructive" });
    },
  });

  return {
    accounts: accounts || [],
    isLoading,
    addAccount: addAccount.mutate,
    updateAccount: updateAccount.mutate,
    deleteAccount: deleteAccount.mutate,
    isAdding: addAccount.isPending,
    isUpdating: updateAccount.isPending,
    isDeleting: deleteAccount.isPending,
  };
}
