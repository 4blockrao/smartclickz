import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthHeader from "./AuthHeader";

type ResetPasswordFormProps = {
  onPasswordSet: () => void;
};

const ResetPasswordForm = ({ onPasswordSet }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      toast({ variant: "destructive", title: "Password too short", description: "Must be at least 8 characters." });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({ variant: "destructive", title: "Update failed", description: error.message });
      } else {
        setPassword("");
        toast({ title: "Password Updated", description: "You can now log in." });
        onPasswordSet();
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message || "An unexpected error occurred" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#9b87f5]/60 via-[#f1f0fb]/95 to-[#e9e4fd]/100 relative pb-8">
      <AuthHeader />
      <div className="w-full max-w-md px-6">
        <div className="mb-5 text-center animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#7e69ab] font-playfair drop-shadow">
            Set New Password
          </h2>
          <p className="mt-1 text-base sm:text-lg text-gray-700 font-semibold">
            Choose a strong new password to secure your account
          </p>
        </div>
        <div className="p-7 sm:p-10 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg border border-[#e9e4fd] flex flex-col gap-2 animate-fade-in transition-all">
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <Input type="password" autoComplete="new-password" required placeholder="New Password (min 8 characters)" value={password} onChange={e => setPassword(e.target.value)} minLength={8} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Setting..." : "Set Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
