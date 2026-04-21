
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Reply } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface CommentsListProps {
  targetId: string;
  targetType: "company" | "user_profile";
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  commenter_profile?: {
    display_name: string;
    profile_image_url: string | null;
  } | null;
  replies?: Reply[];
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  replier_profile?: {
    display_name: string;
    profile_image_url: string | null;
  } | null;
}

const CommentsList: React.FC<CommentsListProps> = ({ targetId, targetType }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: [`${targetType}-comments`, targetId],
    queryFn: async () => {
      let query;
      if (targetType === "company") {
        query = supabase
          .from("company_comments" as any)
          .select(`
            *,
            commenter_profile:profiles!company_comments_commenter_user_id_fkey(
              display_name,
              profile_image_url
            )
          `)
          .eq("company_id", targetId);
      } else {
        query = supabase
          .from("user_profile_comments" as any)
          .select(`
            *,
            commenter_profile:profiles!user_profile_comments_commenter_user_id_fkey(
              display_name,
              profile_image_url
            )
          `)
          .eq("commented_user_id", targetId);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment: any) => {
          const { data: replies, error: repliesError } = await supabase
            .from("comment_replies" as any)
            .select(`
              *,
              replier_profile:profiles!comment_replies_replier_user_id_fkey(
                display_name,
                profile_image_url
              )
            `)
            .eq("parent_comment_id", comment.id)
            .eq("comment_type", targetType)
            .order("created_at", { ascending: true });
          
          if (repliesError) throw repliesError;
          
          return {
            ...comment,
            replies: replies || []
          };
        })
      );
      
      return commentsWithReplies as Comment[];
    },
  });

  const handleReplySubmit = async (commentId: string) => {
    if (!user || !replyContent.trim()) return;
    
    setIsSubmittingReply(true);
    
    try {
      const { error } = await supabase
        .from("comment_replies" as any)
        .insert({
          parent_comment_id: commentId,
          comment_type: targetType,
          replier_user_id: user.id,
          content: replyContent.trim()
        });
      
      if (error) throw error;
      
      toast({
        title: "Reply posted!",
        description: "Your reply has been added successfully",
      });
      
      setReplyContent("");
      setReplyingTo(null);
      
      // Refresh comments
      queryClient.invalidateQueries({ queryKey: [`${targetType}-comments`, targetId] });
    } catch (error: any) {
      toast({
        title: "Failed to post reply",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load comments.
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
        No comments yet. Be the first to start the conversation!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.commenter_profile?.profile_image_url || ""} />
              <AvatarFallback className="bg-primary/10">
                {comment.commenter_profile?.display_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">
                  {comment.commenter_profile?.display_name || "Anonymous User"}
                </h4>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="text-gray-700 whitespace-pre-line mb-2">
                {comment.content}
              </div>
              
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="p-0 h-auto text-sm text-muted-foreground hover:text-primary"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              )}
              
              {/* Reply form */}
              {replyingTo === comment.id && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReplySubmit(comment.id)}
                      disabled={!replyContent.trim() || isSubmittingReply}
                    >
                      {isSubmittingReply ? "Posting..." : "Post Reply"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-6 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.replier_profile?.profile_image_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-xs">
                          {reply.replier_profile?.display_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm">
                            {reply.replier_profile?.display_name || "Anonymous User"}
                          </h5>
                          <span className="text-xs text-muted-foreground">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {reply.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
