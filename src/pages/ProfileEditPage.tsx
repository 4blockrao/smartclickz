
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { ProfileFormValues } from '@/schemas/profileSchema';

const ProfileEditPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const {
    profileData,
    profileLoading,
    profileError,
    updateProfile,
    createProfile,
    isUpdating
  } = useProfileData(user?.id);

  // On submit: create if no profile, or update if profile exists
  const handleSubmit = async (values: ProfileFormValues) => {
    if (!profileData) {
      // Create mode
      createProfile(values);
    } else {
      // Edit/update mode
      updateProfile(values);
    }
  };

  if (authLoading || profileLoading) {
    return <div className="container mx-auto py-8 px-4 text-center">Loading profile information...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>You must be logged in to edit your profile.</p>
        <Button asChild className="mt-4">
          <Link to="/auth">Login</Link>
        </Button>
      </div>
    );
  }

  const hasCompletedProfile = profileData && profileData.full_name && profileData.full_name.trim() !== "";

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-primary/10 via-accent/10 to-white/70">
      <Card className="w-full max-w-2xl mx-auto glass-morphism shadow-xl animate-fade-in border-2 border-indigo-100">
        <CardHeader>
          <CardTitle className="text-3xl font-playfair mb-2">
            {profileData ? (hasCompletedProfile ? "Edit Your Profile" : "Complete Your Profile") : "Create Your Profile"}
          </CardTitle>
          <CardDescription className="text-base mb-3">
            {profileData && hasCompletedProfile
              ? (
                <>
                  Update your profile below.<br />
                  <span className="text-green-700 font-semibold">Tip: Keep your profile up-to-date to make meaningful connections!</span>
                </>
              )
              : (
                <>
                  Welcome! To start exploring Networker Today, let’s set up your profile.<br />
                  <span className="bg-gradient-to-r from-amber-400 to-fuchsia-500 px-2 rounded text-white font-semibold mx-1">+100 points</span> instantly for your first profile completion!
                </>
              )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileEditForm
            profileData={profileData}
            onSubmit={handleSubmit}
            isUpdating={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default ProfileEditPage;
