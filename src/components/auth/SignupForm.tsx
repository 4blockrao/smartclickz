
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthHeader from "./AuthHeader";
import { Mail, Lock, User } from "lucide-react";
import { signupSchema } from "@/lib/validation";

type SignupFormProps = {
  onSignupSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
};

const SignupForm = ({ onSignupSuccess, onSwitchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validationResult = signupSchema.safeParse({
        email,
        password,
        confirmPassword,
      });
      
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      const { data, error } = await supabase.auth.signUp({
        email: validationResult.data.email,
        password: validationResult.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
          }
        }
      });

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('already registered')) {
          throw new Error('This email is already registered. Please try logging in instead.');
        }
        throw error;
      } else if (data.user && data.user.identities?.length === 0) {
        throw new Error('This email is already registered. Please try logging in instead.');
      } else {
        toast({ 
          title: "Welcome to SmartClicks!", 
          description: "Your account has been created successfully." 
        });
        onSignupSuccess(email);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account. Please try again.";
      toast({ 
        variant: "destructive", 
        title: "Signup failed", 
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <AuthHeader />
      
      <div className="w-full max-w-md mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join SmartClicks
            </h2>
            <p className="text-gray-600">
              Start earning from social media tasks
            </p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="text" 
                required 
                placeholder="First Name" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="email" 
                autoComplete="email" 
                required 
                placeholder="Email address" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="password" 
                autoComplete="new-password" 
                required 
                placeholder="Password (min 8 characters)" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                minLength={8} 
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="password" 
                autoComplete="new-password" 
                required 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                minLength={8} 
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
