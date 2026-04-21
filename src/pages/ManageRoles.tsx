
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "moderator" | "admin";

export default function ManageRoles() {
  const { user } = useAuth();
  const [targetUid, setTargetUid] = useState("");
  const [targetRole, setTargetRole] = useState<Role>("moderator");
  const queryClient = useQueryClient();

  // Check if current user is super_admin
  const { data: isSuperadmin } = useQuery({
    queryKey: ["is-superadmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      return data?.some(r => r.role === "super_admin");
    },
    enabled: !!user,
  });

  const { data: userRoles = [] } = useQuery({
    queryKey: ["all-user-roles"],
    queryFn: async () => {
      if (!isSuperadmin) return [];
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
    enabled: isSuperadmin,
  });

  const grantRoleMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("user_roles").insert({
        user_id: targetUid,
        role: targetRole,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTargetUid("");
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
    },
  });

  const revokeRoleMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
    },
  });

  if (!user || !isSuperadmin) {
    return (
      <div className="p-6 text-gray-500">
        Only super admins can manage user roles.
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto py-8">
      <h1 className="text-xl font-bold mb-6">Manage User Roles</h1>

      <form
        className="flex items-end gap-3 mb-8"
        onSubmit={e => {
          e.preventDefault();
          if (!targetUid || !targetRole) return;
          grantRoleMut.mutate();
        }}
      >
        <div>
          <label>User UUID</label>
          <Input value={targetUid} onChange={e => setTargetUid(e.target.value)} placeholder="Target user's UUID" required />
        </div>
        <div>
          <label>Role</label>
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value as Role)}
            className="border rounded px-2 py-1"
          >
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <Button type="submit">Grant Role</Button>
      </form>

      <div>
        <h2 className="font-semibold mb-3">All User Roles</h2>
        <ul className="space-y-2 text-sm">
          {userRoles.map((r: any) => (
            <li key={r.id} className="flex gap-2 items-center">
              <span>
                {typeof r.user_id === "string"
                  ? r.user_id.slice(0, 8)
                  : ""}
                ... - <span className="font-semibold">{r.role}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => revokeRoleMut.mutate(r.id as string)}
              >
                Revoke
              </Button>
            </li>
          ))}
        </ul>
        {userRoles.length === 0 && <div>No user roles yet.</div>}
      </div>
    </section>
  );
}

