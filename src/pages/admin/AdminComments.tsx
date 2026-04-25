
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableCell, TableHead, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminComments() {
  const queryClient = useQueryClient();
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const { data } = await supabase.from("comments").select("id, user_id, content, created_at, target_type, target_id");
      return data || [];
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">Comments</h2>
      {isLoading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-500">Error loading comments.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Target Type</TableHead>
              <TableHead>Target ID</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell className="truncate max-w-[80px]">{c.id.slice(0, 8)}…</TableCell>
                <TableCell className="truncate max-w-[70px]">{c.user_id?.slice(0, 8)}</TableCell>
                <TableCell>{c.target_type}</TableCell>
                <TableCell className="truncate max-w-[70px]">{c.target_id?.slice(0, 8)}</TableCell>
                <TableCell className="max-w-[250px] truncate">{c.content}</TableCell>
                <TableCell>{c.created_at ? new Date(c.created_at).toLocaleString() : ""}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteComment.mutate(c.id)} disabled={deleteComment.isPending}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
