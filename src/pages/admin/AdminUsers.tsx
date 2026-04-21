
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableCell, TableHead, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, user_id, display_name, email, points, created_at, rank, streak");
      return data || [];
    },
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">Users</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading users.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="truncate max-w-[80px]">{u.id.slice(0, 8)}…</TableCell>
                <TableCell>{u.display_name}</TableCell>
                <TableCell>{u.email || <span className="text-gray-500">n/a</span>}</TableCell>
                <TableCell>{u.points}</TableCell>
                <TableCell>{u.rank || "-"}</TableCell>
                <TableCell>{u.streak ?? 0}</TableCell>
                <TableCell>{u.created_at ? new Date(u.created_at).toLocaleDateString() : ""}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/users/${u.id}`}>Edit</Link>
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
