
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, LogIn } from "lucide-react";
import AuthHeader from "./AuthHeader";
import { loginSchema } from "@/lib/validation";

type LoginFormProps = {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPasswordRequest: () => void;
};

const LoginForm = ({
  onLoginSuccess,
  onSwitchToSignup,
  onForgotPasswordRequest,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validationResult = loginSchema.safeParse({ email, password });
      
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
      }

      toast({ title: "Login successful" });
      onLoginSuccess();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to log in. Please try again.";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <AuthHeader />

      <div className="w-full max-w-md mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Log in to SmartClicks & start earning
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
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
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={8}
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex gap-2 items-center justify-center"
              disabled={loading}
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="flex flex-col items-center mt-6 space-y-2">
            <Button
              variant="link"
              type="button"
              onClick={onForgotPasswordRequest}
              className="text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Button>
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
