
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface CommentFormProps {
  targetId: string;
  targetType: "company" | "user_profile";
  onCommentAdded?: () => void;
}

interface CommentFormValues {
  content: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ targetId, targetType, onCommentAdded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormValues>();
  
  const onSubmit = async (data: CommentFormValues) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a comment",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let insertData;
      if (targetType === "company") {
        insertData = {
          company_id: targetId,
          commenter_user_id: user.id,
          content: data.content
        };
        const { error } = await supabase.from("company_comments" as any).insert(insertData);
        if (error) throw error;
      } else {
        insertData = {
          commented_user_id: targetId,
          commenter_user_id: user.id,
          content: data.content
        };
        const { error } = await (supabase as any).from("user_profile_comments" as any).insert(insertData);
        if (error) throw error;
      }
      
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`${targetType}-comments`, targetId] });
      
      // Reset form
      reset();
      onCommentAdded?.();
    } catch (error: any) {
      toast({
        title: "Failed to post comment",
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
          <p className="mb-2">Please sign in to leave a comment</p>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign in
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Add a Comment
        </label>
        <Textarea
          id="content"
          placeholder="Share your thoughts..."
          className="min-h-[80px]"
          {...register("content", {
            required: "Comment content is required",
            minLength: {
              value: 3,
              message: "Comment should be at least 3 characters"
            }
          })}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};

export default CommentForm;
