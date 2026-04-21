import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileExperience, ProfileExperienceFormValues } from "@/schemas/profileSchema";
import { useToast } from "@/hooks/use-toast";

export const useProfileExperience = (profileId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey = ['profileExperience', profileId];

  const {
    data: experiences,
    isLoading: isLoadingExperiences,
    error: experienceError,
  } = useQuery<ProfileExperience[]>({
    queryKey,
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('profile_experience')
        .select('*')
        .eq('profile_id', profileId)
        .order('start_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!profileId,
  });

  const addExperienceMutation = useMutation({
    mutationFn: async (values: ProfileExperienceFormValues) => {
      if (!profileId) throw new Error("Profile ID is required.");

      const experienceDataToInsert = {
        profile_id: profileId,
        company_name: values.company_name,
        title: values.title,
        start_date: values.start_date,
        end_date: (values.end_date === '' || values.end_date == null) ? null : values.end_date,
        description: values.description ?? null,
        location: values.location ?? null,
        employment_type: values.employment_type ?? null,
      };

      const { error } = await supabase
        .from('profile_experience')
        .insert([experienceDataToInsert]);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      toast({ title: 'Experience Added', description: 'New work experience has been saved.' });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Add Failed', description: error.message });
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: ProfileExperienceFormValues }) => {
      const experienceDataToUpdate = {
        company_name: values.company_name,
        title: values.title,
        start_date: values.start_date,
        end_date: (values.end_date === '' || values.end_date == null) ? null : values.end_date,
        description: values.description ?? null,
        location: values.location ?? null,
        employment_type: values.employment_type ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profile_experience')
        .update(experienceDataToUpdate)
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      toast({ title: 'Experience Updated', description: 'Work experience has been updated.' });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      const { error } = await supabase
        .from('profile_experience')
        .delete()
        .eq('id', experienceId);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      toast({ title: 'Experience Deleted', description: 'Work experience has been removed.' });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Delete Failed', description: error.message });
    },
  });

  return {
    experiences,
    isLoadingExperiences,
    experienceError,
    addExperience: addExperienceMutation.mutate,
    isAddingExperience: addExperienceMutation.isPending,
    updateExperience: updateExperienceMutation.mutate,
    isUpdatingExperience: updateExperienceMutation.isPending,
    deleteExperience: deleteExperienceMutation.mutate,
    isDeletingExperience: deleteExperienceMutation.isPending,
  };
};
