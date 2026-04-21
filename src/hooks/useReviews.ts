
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useReviews(companyId?: string) {
  return useQuery({
    queryKey: ["reviews", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      company_id,
      rating,
      review,
      user_id,
    }: {
      company_id: string;
      user_id: string;
      rating: number;
      review: string;
    }) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            company_id,
            rating,
            review,
            user_id,
          },
        ]);
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.company_id] });
    },
  });
}
