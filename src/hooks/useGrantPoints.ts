
import { supabase } from "@/integrations/supabase/client";

// Helper to award points to a user (additive, handles initial null/undefined)
export async function grantPoints(userId: string, points: number, reason?: string) {
  // Add points to the user profile (additive)
  // Fetch current points
  const { data, error } = await supabase
    .from("profiles")
    .select("points")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return;

  const prevPoints = typeof data.points === "number" ? data.points : 0;
  await supabase
    .from("profiles")
    .update({ points: prevPoints + points })
    .eq("user_id", userId);

  // Optionally could insert points_ledger entry for audit/history
}
