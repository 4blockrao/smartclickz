import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthHeader from "./AuthHeader";

type ForgotPasswordFormProps = {
  onOtpSent: (email: string) => void;
  onBackToLogin: () => void;
};

const ForgotPasswordForm = ({ onOtpSent, onBackToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Missing Email", description: "Please enter your email.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo is not needed for OTP type 'recovery'
      });
      
      if (error) {
        toast({ variant: "destructive", title: "Reset failed", description: error.message });
      } else {
        onOtpSent(email);
        toast({ 
          title: "Reset Code Sent", 
          description: "We've sent you a verification code. Please check your email (including spam folder)." 
        });
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
            Forgot Password?
          </h2>
          <p className="mt-1 text-base sm:text-lg text-gray-700 font-semibold">
            Enter your email to receive a reset code
          </p>
        </div>
        <div className="p-7 sm:p-10 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg border border-[#e9e4fd] flex flex-col gap-2 animate-fade-in transition-all">
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input type="email" autoComplete="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button variant="link" onClick={onBackToLogin}>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
