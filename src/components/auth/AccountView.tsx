
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type AccountViewProps = {
  user: User;
  onLogout: () => void;
};

type Profile = {
  display_name: string;
  bio: string;
  key_skills: string;
};

const AccountView = ({ user, onLogout }: AccountViewProps) => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [keySkills, setKeySkills] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, bio, key_skills")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast({ variant: "destructive", title: "Error fetching profile", description: error.message });
      } else if (data) {
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setKeySkills(data.key_skills || "");
      }
      setLoadingProfile(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const profileData: Partial<Profile> = {
      display_name: displayName,
      bio,
      key_skills: keySkills,
    };

    const { error } = await supabase
      .from("profiles")
      .update({ ...profileData, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    setUpdating(false);
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    } else {
      toast({ title: "Profile updated" });
    }
  };

  if (loadingProfile) {
    return <div className="text-center p-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 shadow bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-4">Account</h2>
      <div className="mb-4">Email: <b>{user.email}</b></div>
      <form onSubmit={handleProfileUpdate} className="space-y-3 mb-5">
        <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display Name" />
        <Input value={keySkills} onChange={e => setKeySkills(e.target.value)} placeholder="Key Skills (comma-separated)" />
        <textarea className="w-full border border-input rounded p-2 text-sm" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" />
        <Button type="submit" disabled={updating} className="w-full">{updating ? "Updating..." : "Update Profile"}</Button>
      </form>
      <Button variant="outline" className="w-full" onClick={onLogout}>Logout</Button>
    </div>
  );
};

export default AccountView;
