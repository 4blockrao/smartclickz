import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface SignupFormMultiStepProps {
  onSignupSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
  initialInviteCode?: string;
}

/**
 * Simple single-page registration: Name, email, password, confirm password.
 * The referral code (from an invite link ?ref=) is captured silently and passed
 * into signup metadata so the MLM/referral trigger still links the sponsor.
 */
const SignupFormMultiStep: React.FC<SignupFormMultiStepProps> = ({
  onSignupSuccess,
  onSwitchToLogin,
  initialInviteCode = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast({ title: "Please enter your name", variant: "destructive" });
    if (!email.trim()) return toast({ title: "Please enter your email", variant: "destructive" });
    if (password.length < 8) return toast({ title: "Password must be at least 8 characters", variant: "destructive" });
    if (password !== confirmPassword) return toast({ title: "Passwords do not match", variant: "destructive" });

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: name.trim(),
            referral_code: initialInviteCode || "",
          },
        },
      });

      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        return;
      }

      // Supabase returns a user with empty identities when the email already exists.
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        toast({
          title: "Account already exists",
          description: "Please sign in with this email instead.",
          variant: "destructive",
        });
        onSwitchToLogin();
        return;
      }

      // No session => email confirmation is required before the user can sign in.
      if (!data.session) {
        toast({
          title: "Check your email",
          description: "We sent a confirmation link. Click it to activate your account, then sign in.",
        });
        onSwitchToLogin();
        return;
      }

      onSignupSuccess(email.trim());
    } catch (err: any) {
      toast({ title: "Signup error", description: err?.message || "Unknown error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ background: "linear-gradient(120deg, #f1effb 0%, #b7a5f6 60%, #9b87f5 95%, #f1effb 100%)" }}
    >
      <div className="mb-6 w-full max-w-md text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#7567c6] tracking-tight mb-2">
          Create your account
        </h1>
        <p className="text-[#8571e6] font-semibold">Start earning in minutes — it's free.</p>
      </div>

      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl border border-[#e9e4fd] p-7 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              className="mt-1"
            />
          </div>

          {initialInviteCode ? (
            <p className="text-xs text-[#8571e6]">
              Referral code applied: <span className="font-semibold">{initialInviteCode}</span>
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupFormMultiStep;
