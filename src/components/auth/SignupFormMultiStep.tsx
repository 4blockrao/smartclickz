import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignupFormFields from "./SignupFormFields";
import { Button } from "@/components/ui/button";

interface SignupFormMultiStepProps {
  onSignupSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
  initialInviteCode?: string;
}

const SignupFormMultiStep: React.FC<SignupFormMultiStepProps> = ({
  onSignupSuccess,
  onSwitchToLogin,
  initialInviteCode = "",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
      country: "",
      city: "",
      interests: [],
      referralCode: initialInviteCode
    }
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            country: data.country,
            city: data.city,
            interests: data.interests,
            referral_code: data.referralCode
          }
        }
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      onSignupSuccess(data.email);
      toast({
        title: "Account created!",
        description: "Welcome to SmartClicks! You can now start earning.",
      });

    } catch (err: any) {
      toast({
        title: "Signup error",
        description: err?.message || "Unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-2 sm:p-6"
      style={{
        background:
          "linear-gradient(120deg, #f1effb 0%, #b7a5f6 60%, #9b87f5 95%, #f1effb 100%)",
      }}
    >
      <div className="mb-6 w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold font-playfair text-center text-[#7567c6] tracking-tight drop-shadow mb-2 animate-fade-in">
          Welcome to SmartClicks!
        </h1>
        <p className="text-center text-lg text-[#8571e6] font-inter mb-1 animate-fade-in font-semibold">
          Start earning through social media tasks.
        </p>
        <p className="text-center text-gray-600 font-inter mb-3 animate-fade-in italic">
          Join the future of social media marketing. It's <span className="font-bold">free</span>
        </p>
      </div>
      
      <div className="w-full max-w-md bg-white/95 rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e9e4fd] p-7 sm:p-8 transition-all card-modern animate-fade-in">
        {/* Step Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <SignupFormFields form={form} currentStep={currentStep} />
          
          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1"
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            )}
          </div>
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