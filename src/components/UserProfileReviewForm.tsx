
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface UserProfileReviewFormProps {
  userId: string;
}

interface ReviewFormValues {
  review: string;
}

const UserProfileReviewForm: React.FC<UserProfileReviewFormProps> = ({ userId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>();
  
  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a review",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    if (user.id === userId) {
      toast({
        title: "Cannot review yourself",
        description: "You cannot leave a review on your own profile",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("user_profile_reviews" as any)
        .insert({
          reviewer_user_id: user.id,
          reviewed_user_id: userId,
          review: data.review,
          rating
        });
        
      if (error) throw error;
      
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["user-reviews", userId] });
      
      // Reset form
      reset();
      setRating(0);
    } catch (error: any) {
      toast({
        title: "Failed to submit review",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-center">
          <p className="mb-2">Please sign in to leave a review</p>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign in
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (user.id === userId) {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition-colors ${
                star <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="review" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <Textarea
          id="review"
          placeholder="Share your experience with this networker..."
          className="min-h-[100px]"
          {...register("review", {
            required: "Review text is required",
            minLength: {
              value: 10,
              message: "Review should be at least 10 characters"
            }
          })}
        />
        {errors.review && (
          <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default UserProfileReviewForm;
