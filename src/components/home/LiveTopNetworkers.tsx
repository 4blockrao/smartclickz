import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { StandardNetworkerCard } from "@/components/cards/StandardNetworkerCard";
import { useAuthCTA } from "@/components/cards/AuthCTAHelper";

export default function LiveTopNetworkers() {
  const navigate = useNavigate();
  const useAuthCta = useAuthCTA();
  const { data, isLoading } = useQuery({
    queryKey: ["top-networkers-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, referral_user_id, display_name, profile_image_url, key_skills, country, city, bio")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-4 sm:p-6 rounded-2xl bg-white/95 flex flex-col gap-4 shadow-xl hover:shadow-2xl">
      <span className="font-playfair text-2xl font-bold text-[#b46b39] mb-2">Top Networkers</span>
      <div className="grid grid-cols-1 gap-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          : data?.map((net) => (
              <StandardNetworkerCard
                key={net.id}
                id={net.referral_user_id || net.id}
                name={net.display_name}
                age={undefined}
                photo={net.profile_image_url}
                city={net.city}
                country={net.country}
                company={""}
                tagline={net.bio}
                primarySkill={net.key_skills ? net.key_skills.split(",")[0] : ""}
                isVerified={false}
                profileUrl={`/profiles/${net.referral_user_id || net.id}`}
                onFollow={() => useAuthCta(() => {/* e.g., API to follow networker */})}
                onMessage={() => useAuthCta(() => navigate(`/profiles/${net.referral_user_id || net.id}`))}
              />
            ))}
      </div>
      <button className="mt-3 underline text-primary text-sm font-semibold hover:text-secondary transition" onClick={() => navigate("/profiles")}>View all networkers</button>
    </Card>
  );
}
