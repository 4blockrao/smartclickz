
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

interface UserProfileReviewListProps {
  userId: string;
}

interface UserReview {
  id: string;
  reviewer_user_id: string;
  rating: number;
  review: string;
  created_at: string;
  reviewer_profile: {
    display_name: string;
    profile_image_url: string | null;
  } | null;
}

const UserProfileReviewList: React.FC<UserProfileReviewListProps> = ({ userId }) => {
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ["user-reviews", userId],
    queryFn: async () => {
      // For now, return empty array since user_profile_reviews table doesn't exist yet
      // This will be updated when the proper database migration is run
      return [] as UserReview[];
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load reviews.
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id}>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={review.reviewer_profile?.profile_image_url || ""} />
              <AvatarFallback className="bg-primary/10">
                {review.reviewer_profile?.display_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    {review.reviewer_profile?.display_name || "Anonymous User"}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-gray-700 whitespace-pre-line">
                {review.review}
              </div>
            </div>
          </div>
          <Separator className="mt-4" />
        </div>
      ))}
    </div>
  );
};

export default UserProfileReviewList;
