
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Utility hook to wrap CTA handlers that require login.
 * Call returned function with the action that needs authentication.
 * If not logged in, redirects to /auth.
 */
export function useAuthCTA() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (action: () => void) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    action();
  };
}
