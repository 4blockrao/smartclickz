import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Route guard for /admin/* pages. Renders the nested routes (<Outlet />) only
 * for signed-in users who hold an `admin` or `super_admin` role in user_roles.
 * Everyone else is redirected (unauthenticated -> /auth, non-admin -> /).
 */
export default function RequireAdmin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "super_admin"]);

      if (!active) return;

      const ok = !error && !!data && data.length > 0;
      setIsAdmin(ok);
      setChecking(false);

      if (!ok) {
        toast.error("Admin access required.");
        navigate("/", { replace: true });
      }
    })();

    return () => {
      active = false;
    };
  }, [user, loading, navigate]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (!isAdmin) return null;

  return <Outlet />;
}
