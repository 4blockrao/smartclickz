
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { StandardNetworkerCard } from "@/components/cards/StandardNetworkerCard";
import Layout from "@/components/Layout";

const fetchProfiles = async () => {
  let { data, error } = await supabase
    .from("profiles")
    .select("id, referral_user_id, display_name, bio, key_skills, profile_image_url, city, country")
    .order("display_name", { ascending: true });
  if (error) throw error;
  return data;
};

export default function Profiles() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
  });

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-3 text-foreground">Networker Directory</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Explore top MLM leaders, networkers, and professionals. Tap a profile to view their expertise, gallery, social wall, and more.
                </p>
              </div>
              <div>
                <Link
                  to="/profiles"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Find Networkers
                </Link>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading networkers...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">Failed to load profiles.</p>
            </div>
          )}
          
          {data && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((profile) => (
                <StandardNetworkerCard
                  key={profile.id}
                  id={profile.referral_user_id || profile.id}
                  name={profile.display_name}
                  age={undefined}
                  photo={profile.profile_image_url}
                  city={profile.city}
                  country={profile.country}
                  company={""}
                  tagline={profile.bio}
                  primarySkill={profile.key_skills ? profile.key_skills.split(",")[0] : ""}
                  isVerified={false}
                  profileUrl={`/profiles/${profile.referral_user_id || profile.id}`}
                  onFollow={() => {/* actual follow logic could be implemented here */}}
                  onMessage={() => {/* trigger message, open chat, or navigate to detail */}}
                />
              ))}
            </div>
          )}
          
          {data && data.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No networkers found yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
