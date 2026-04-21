
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProfileFormValues, profileFormSchema, UserProfile } from '@/schemas/profileSchema';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProfileEditFormProps {
  profileData: UserProfile | null;
  onSubmit: (values: ProfileFormValues) => void;
  isUpdating: boolean;
}

const collabOptions = [
  "Product Co-founder", "Startup Mentorship", "Freelance Gigs", "Networking Events", "Other"
];

const lookingOptions = [
  "Inspiration", "Expert Guidance", "Team Members", "Side Hustle Ideas", "Clients", "Hiring"
];

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profileData,
  onSubmit,
  isUpdating
}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      username: '',
      profile_image_url: '',
      city: '',
      country: '',
      bio: '',
      current_role: '',
      company: '',
      industry: '',
      key_skills: '',
      date_of_birth: undefined,
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        full_name: profileData.full_name || '',
        username: profileData.username || '',
        profile_image_url: profileData.profile_image_url || '',
        city: profileData.city || '',
        country: profileData.country || '',
        bio: profileData.bio || '',
        current_role: profileData.current_role || '',
        company: profileData.company || '',
        industry: profileData.industry || '',
        key_skills: profileData.key_skills || '',
        date_of_birth: profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
      });
    }
  }, [profileData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Info */}
        <div className="border-b pb-2">
          <h2 className="font-semibold text-lg mb-3 text-primary">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField name="full_name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="username" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Username/@Handle</FormLabel>
                <FormControl><Input placeholder="@yourhandle" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <FormField name="profile_image_url" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl><Input placeholder="Image URL" type="url" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-2">
              <FormField name="city" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl><Input placeholder="City" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="country" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl><Input placeholder="Country" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
          <FormField name="date_of_birth" control={form.control} render={({ field }) => (
            <FormItem className="pt-2">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full sm:w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(field.value, "PPP")
                        : <span>Select date of birth</span>
                      }
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age for the profile card.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="bio" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="One or two lines about you" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Professional Snapshot */}
        <div className="border-b pb-2">
          <h2 className="font-semibold text-lg mb-3 text-primary">Professional Snapshot</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField name="current_role" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Current Role</FormLabel>
                <FormControl><Input placeholder="Your role" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="company" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl><Input placeholder="Company" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <FormField name="industry" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl><Input placeholder="Industry" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="key_skills" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Key Skills</FormLabel>
                <FormControl><Input placeholder="e.g., React, Marketing..." {...field} /></FormControl>
                <FormDescription>Comma-separated, e.g., Design, SEO, Sales</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Gamification (display only) */}
        <div className="flex flex-wrap items-center gap-5 pt-3">
          {profileData?.badge && <span className="bg-amber-200 px-3 py-1 rounded font-semibold">Badge: {profileData.badge}</span>}
          {profileData?.points && <span className="bg-purple-100 px-3 py-1 rounded font-semibold">Points: {profileData.points}</span>}
          {profileData?.referral_code && <span className="bg-fuchsia-100 px-3 py-1 rounded font-semibold">Referral Code: {profileData.referral_code}</span>}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-3">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
