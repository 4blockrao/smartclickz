
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableCell, TableHead, TableBody } from "@/components/ui/table";

export default function AdminActivityLog() {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["admin-activity-log"],
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_log")
        .select("id, user_id, event_type, text, timestamp")
        .order("timestamp", { ascending: false });
      return data || [];
    },
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">Activity Log</h2>
      {isLoading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-500">Error loading activity log.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="truncate max-w-[80px]">{a.id.slice(0, 8)}…</TableCell>
                <TableCell className="truncate max-w-[70px]">{a.user_id?.slice(0, 8)}</TableCell>
                <TableCell>{a.event_type}</TableCell>
                <TableCell className="max-w-[320px] truncate">{a.text}</TableCell>
                <TableCell>{a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
