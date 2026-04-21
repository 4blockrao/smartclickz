
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileExperience, ProfileExperienceFormValues, profileExperienceFormSchema } from '@/schemas/profileSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface ProfileExperienceFormProps {
  profileId: string;
  experienceToEdit?: ProfileExperience | null;
  onSubmitForm: (values: ProfileExperienceFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Helper to format date for input type="date"
const formatDateForInput = (dateString?: string | null) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch (e) {
    return ''; // handle invalid date string
  }
};

export const ProfileExperienceForm: React.FC<ProfileExperienceFormProps> = ({
  experienceToEdit,
  onSubmitForm,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm<ProfileExperienceFormValues>({
    resolver: zodResolver(profileExperienceFormSchema),
    defaultValues: {
      company_name: experienceToEdit?.company_name || '',
      title: experienceToEdit?.title || '',
      location: experienceToEdit?.location || '',
      employment_type: experienceToEdit?.employment_type || '',
      start_date: formatDateForInput(experienceToEdit?.start_date),
      end_date: formatDateForInput(experienceToEdit?.end_date),
      description: experienceToEdit?.description || '',
    },
  });

  const handleSubmit = (values: ProfileExperienceFormValues) => {
    onSubmitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl><Input placeholder="Ex: Google" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="Ex: Software Engineer" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input placeholder="Ex: London, UK" {...field} value={field.value ?? ''} /></FormControl>
              <FormDescription>City, Country (e.g. San Francisco, CA)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type</FormLabel>
              <FormControl><Input placeholder="Ex: Full-time" {...field} value={field.value ?? ''} /></FormControl>
              <FormDescription>E.g., Full-time, Part-time, Contract, Internship</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (or expected)</FormLabel>
                 <Input type="date" {...field} value={field.value ?? ''} />
                <FormDescription>Leave blank if current</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Describe your responsibilities and achievements." className="min-h-[100px]" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (experienceToEdit ? 'Saving...' : 'Adding...') : (experienceToEdit ? 'Save Changes' : 'Add Experience')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
