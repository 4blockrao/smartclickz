import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

import OtpVerification from "@/components/OtpVerification";
import LoginForm from "@/components/auth/LoginForm";
import SignupFormMultiStep from "@/components/auth/SignupFormMultiStep";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AccountView from "@/components/auth/AccountView";

type AuthView = "login" | "signup" | "otp" | "forgot_password" | "reset_password" | "account";

const Auth = () => {
  const { user, session, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [pendingEmailForOtp, setPendingEmailForOtp] = useState("");
  const [otpType, setOtpType] = useState<"signup" | "forgot">("signup");
  const [inviteCode, setInviteCode] = useState<string>("");

  // Helper to get invite/referral code from URL (?ref=AAxxxx)
  const getInviteCodeFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("ref") || "";
  };

  // Check on page load: if ref in URL, show signup with prefilled code
  useEffect(() => {
    const ref = getInviteCodeFromQuery();
    if (ref) {
      setCurrentView("signup");
      setInviteCode(ref);
    }
  }, [location.search]);

  // Enhanced auth redirect logic - FIXED to prevent auto-login from copied URLs
  useEffect(() => {
    if (!authLoading) {
      // Don't auto-redirect while the user is mid-flow on these views — a session
      // may legitimately exist (e.g. the recovery session during password reset).
      const stayViews = ["account", "reset_password", "otp", "forgot_password"];
      if (session && user && !stayViews.includes(currentView)) {
        const sessionAge = session.expires_at ? (session.expires_at * 1000) - Date.now() : 0;
        if (sessionAge > 0) {
          const from = location.state?.from || "/dashboard";
          navigate(from, { replace: true });
        } else {
          logout();
          setCurrentView("login");
        }
      }
    }
  }, [session, user, authLoading, navigate, location.state, currentView]);

  const handleLoginSuccess = () => {
    const from = location.state?.from || "/dashboard";
    navigate(from, { replace: true });
  };

  const handleSignupSuccess = (email: string) => {
    toast({
      title: "Account created!",
      description: "You are now signed in.",
    });
    const from = location.state?.from || "/dashboard";
    navigate(from, { replace: true });
  };

  const handleForgotPasswordRequest = () => {
    setCurrentView("forgot_password");
  };

  const handleOtpSentForPasswordReset = (email: string) => {
    setPendingEmailForOtp(email);
    setOtpType("forgot");
    setCurrentView("otp");
  };
  
  const handleOtpVerified = (verifiedSession: any) => {
    if (otpType === "forgot") {
      setCurrentView("reset_password"); 
      toast({ title: "Verified", description: "You can now set a new password." });
    } else { // signup
      toast({ title: "Account verified!", description: "Welcome! You're now signed in." });
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    }
  };

  const handlePasswordSet = () => {
    setCurrentView("login");
    toast({ title: "Password Updated", description: "Please log in with your new password."});
  };
  
  const handleBackFromOtp = () => {
    if (otpType === "signup") {
      setCurrentView("signup");
    } else { // forgot password
      setCurrentView("forgot_password");
    }
    setPendingEmailForOtp("");
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView("login");
    toast({ title: "Logged out" });
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#b39ddb]/80 via-[#9b87f5]/90 to-[#221f26]/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <span className="text-lg font-semibold text-white">Loading...</span>
        </div>
      </div>
    );
  }

  // Force login if no valid session - FIXED
  if (!session || !user) {
    // Show the appropriate auth form based on current view
    if (currentView === "otp" && otpType === "forgot" && pendingEmailForOtp) {
      return (
        <OtpVerification
          email={pendingEmailForOtp}
          onVerified={handleOtpVerified}
          onBack={handleBackFromOtp}
          type={otpType}
        />
      );
    }

    if (currentView === "reset_password") {
      return <ResetPasswordForm onPasswordSet={handlePasswordSet} onBack={() => setCurrentView("login")} />;
    }

    if (currentView === "forgot_password") {
      return <ForgotPasswordForm onOtpSent={handleOtpSentForPasswordReset} onBackToLogin={() => setCurrentView("login")} />;
    }
    
    if (currentView === "signup") {
      return (
        <SignupFormMultiStep
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setCurrentView("login")}
          initialInviteCode={inviteCode || getInviteCodeFromQuery()}
        />
      );
    }

    // Default to login
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess} 
        onSwitchToSignup={() => setCurrentView("signup")}
        onForgotPasswordRequest={handleForgotPasswordRequest}
      />
    );
  }

  // Show AccountView if user is authenticated and wants to see account
  if (currentView === "account") {
    return <AccountView user={user} onLogout={handleLogout} />;
  }

  // If user is authenticated but viewing auth page, redirect to dashboard
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#b39ddb]/80 via-[#9b87f5]/90 to-[#221f26]/80">
      <div className="text-center text-white">
        <p className="text-lg mb-4">You're already logged in!</p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Auth;
