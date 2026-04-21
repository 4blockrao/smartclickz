import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableCell, TableHead, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPosts() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("id, user_id, content, created_at, likes");
      return data || [];
    },
  });

  const [newPostContent, setNewPostContent] = useState("");
  const insertPost = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("posts").insert({ content: newPostContent, user_id: "admin" });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPostContent("");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">Posts</h2>
      <form
        className="flex gap-2 items-end mb-4"
        onSubmit={e => {
          e.preventDefault();
          if (newPostContent.trim() !== "") insertPost.mutate();
        }}
      >
        <Input value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="New post content…" />
        <Button type="submit" disabled={insertPost.isPending}>Add Post</Button>
      </form>
      {isLoading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-500">Error loading posts.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="truncate max-w-[80px]">{p.id.slice(0, 8)}…</TableCell>
                <TableCell className="truncate max-w-[70px]">{p.user_id ? String(p.user_id).slice(0, 8) : "?"}</TableCell>
                <TableCell className="max-w-[250px] truncate">{p.content}</TableCell>
                <TableCell>{p.likes}</TableCell>
                <TableCell>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deletePost.mutate(p.id)} disabled={deletePost.isPending}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
