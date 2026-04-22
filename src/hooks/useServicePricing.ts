import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

const sb = supabase as any;

export function useServicePricing() {
  return useQuery({
    queryKey: ["service-pricing"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("service_pricing")
        .select("*")
        .order("service_name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUpdateServicePricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...fields
    }: { id: string; point_cost?: number; display_label?: string; is_active?: boolean; notes?: string }) => {
      const { data, error } = await sb
        .from("service_pricing")
        .update(fields)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-pricing"] });
    },
  });
}

export function useCreateServicePricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      service_name, display_label, point_cost, is_active, notes,
    }: {
      service_name: string; display_label: string; point_cost: number; is_active?: boolean; notes?: string;
    }) => {
      const { data, error } = await sb.from("service_pricing").insert([
        { service_name, display_label, point_cost, is_active, notes },
      ]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-pricing"] });
    },
  });
}

export function useServicePointCost(serviceName: string) {
  const { data: allPricing, isLoading, error } = useServicePricing();
  const serviceRow = useMemo(
    () => allPricing?.find((r: any) => r.service_name === serviceName),
    [allPricing, serviceName]
  );
  return {
    pointCost: serviceRow?.point_cost ?? null,
    isLoading,
    error,
    serviceRow,
  };
}
