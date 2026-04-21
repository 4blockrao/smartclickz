
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type OtpVerificationProps = {
  email: string;
  onVerified: (session: any) => void;
  onBack: () => void;
  type: "signup" | "forgot";
};

const OtpVerification = ({ email, onVerified, onBack, type }: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ variant: "destructive", title: "Invalid OTP", description: "Enter the 6-digit code sent to your email." });
      return;
    }
    
    setLoading(true);
    let result;
    
    if (type === "signup") {
      result = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });
    } else {
      // type === 'forgot'
      result = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "recovery",
      });
    }
    
    setLoading(false);
    const { data, error } = result;
    
    if (error) {
      toast({ variant: "destructive", title: "Verification failed", description: error.message });
    } else {
      toast({ title: "Verification Success" });
      onVerified(data.session);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      let result;
      
      if (type === "signup") {
        result = await supabase.auth.signUp({
          email,
          password: "temporary-password-for-otp", // Will be updated later
          options: {
            emailRedirectTo: window.location.origin + "/auth",
          }
        });
      } else {
        result = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/auth"
        });
      }
      
      const { error } = result;
      if (error) {
        toast({ variant: "destructive", title: "Failed to resend code", description: error.message });
      } else {
        toast({ title: "Code sent", description: "A new verification code has been sent to your email" });
        setOtp("");  // Clear the current OTP input
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 shadow bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Enter the 6-digit code</h2>
      <p className="mb-4 text-center text-muted-foreground">
        We sent the code to <span className="font-medium">{email}</span>
      </p>
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="flex items-center justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            autoFocus
            onChange={setOtp}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
      
      <div className="mt-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Didn't receive a code? 
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResendOtp}
          disabled={resending}
          className="mx-auto"
        >
          {resending ? "Sending..." : "Resend Code"}
        </Button>
        
        <Button variant="link" type="button" onClick={onBack} className="block w-full mt-2">
          Back to {type === "signup" ? "Signup" : "Reset"}
        </Button>
      </div>
    </div>
  );
};

export default OtpVerification;
