
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase as _supabase } from '@/integrations/supabase/client';
const supabase = _supabase as any;
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  Eye, 
  Share2,
  MessageCircle,
  UserPlus,
  Briefcase,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { GallerySection } from '@/components/profile/GallerySection';
import UserProfileReviewForm from '@/components/UserProfileReviewForm';
import UserProfileReviewList from '@/components/UserProfileReviewList';
import CommentForm from '@/components/CommentForm';
import CommentsList from '@/components/CommentsList';

const ProfileDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          profile_details!inner(*)
        `)
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Fetch gallery images
  const { data: gallery = [], isLoading: loadingGallery } = useQuery({
    queryKey: ['profile-gallery', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('profile_gallery')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Fetch social posts
  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['profile-posts', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('profile_posts')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Fetch work experience
  const { data: experience = [], isLoading: loadingExperience } = useQuery({
    queryKey: ['profile-experience', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('profile_experience')
        .select('*')
        .eq('profile_id', profile.id)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow users",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from('profile_followers')
        .insert({
          follower_id: user.id,
          following_id: userId!
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You are now following this user"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to send connection requests",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          receiver_id: userId!,
          message: "I'd like to connect with you!"
        });

      if (error) throw error;

      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.display_name}'s Profile`,
        text: `Check out ${profile?.display_name}'s profile on Networker Today`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard"
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-muted-foreground mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const profileDetails = profile.profile_details?.[0];
  const age = profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Cover Image & Profile Header */}
        <Card className="overflow-hidden">
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/20 to-secondary/20">
            {profile.cover_image_url && (
              <img
                src={profile.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={profile.profile_image_url || ""} />
                <AvatarFallback className="text-2xl">
                  {profile.display_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                      {profile.display_name}
                      {profile.is_verified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Verified
                        </Badge>
                      )}
                    </h1>
                    {profileDetails?.current_role && (
                      <p className="text-xl text-muted-foreground mt-1">
                        {profileDetails.current_role}
                        {profileDetails.company && ` at ${profileDetails.company}`}
                      </p>
                    )}
                    {profile.bio && (
                      <p className="text-muted-foreground mt-2 max-w-2xl">{profile.bio}</p>
                    )}
                  </div>
                  
                  {user?.id !== userId && (
                    <div className="flex gap-2">
                      <Button onClick={handleConnect}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button variant="outline" onClick={handleFollow}>
                        <Users className="w-4 h-4 mr-2" />
                        Follow
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/inbox')}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {(profile.city || profile.country) && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {age && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{age} years old</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{profile.profile_views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                {/* About Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.bio && (
                      <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                    )}
                    
                    {profile.specialization && (
                      <div>
                        <h4 className="font-semibold mb-2">Specialization</h4>
                        <p className="text-muted-foreground">{profile.specialization}</p>
                      </div>
                    )}
                    
                    {profile.achievements && (
                      <div>
                        <h4 className="font-semibold mb-2">Achievements</h4>
                        <p className="text-muted-foreground">{profile.achievements}</p>
                      </div>
                    )}
                    
                    {profile.languages && (
                      <div>
                        <h4 className="font-semibold mb-2">Languages</h4>
                        <p className="text-muted-foreground">{profile.languages}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {profile.key_skills && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.key_skills.split(',').map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserProfileReviewList userId={userId!} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Leave a Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserProfileReviewForm userId={userId!} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CommentsList targetId={userId!} targetType="user_profile" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Add a Comment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CommentForm targetId={userId!} targetType="user_profile" />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-6">
                <GallerySection gallery={[]} loadingGallery={false} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.follower_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.following_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.connection_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.points || 0}</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Social</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {profile.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {profile.facebook_url && (
                  <a
                    href={profile.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                )}
                {profile.instagram_url && (
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
                {profile.youtube_url && (
                  <a
                    href={profile.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Availability Status */}
            {profile.availability_status && (
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant={profile.availability_status === 'Available' ? 'default' : 'secondary'}
                    className="w-full justify-center"
                  >
                    {profile.availability_status}
                  </Badge>
                  {profile.time_zone && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {profile.time_zone}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
