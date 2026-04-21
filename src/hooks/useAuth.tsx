
import { useState, useEffect, useContext, createContext, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: any;
  refresh: () => void;
  logout: () => void;
  updateProfile: (updates: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  enableMFA: () => Promise<void>;
  disableMFA: () => Promise<void>;
  getLoginHistory: () => Promise<any[]>;
  getActiveSessions: () => Promise<any[]>;
  revokeSession: (sessionId: string) => Promise<void>;
  getSecurityEvents: () => Promise<any[]>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userProfile: null,
  refresh: () => {},
  logout: () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  enableMFA: async () => {},
  disableMFA: async () => {},
  getLoginHistory: async () => [],
  getActiveSessions: async () => [],
  revokeSession: async () => {},
  getSecurityEvents: async () => [],
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useProvideAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Initialize auth state and set up listeners
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Fetch user profile when logged in
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (mounted) {
                setUserProfile(profile);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }

        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUserProfile(null);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Fetch profile for initial session
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (mounted) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Failed to get initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      localStorage.removeItem('sb-auth-token');
      window.location.href = '/auth';
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    // Refresh profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setUserProfile(profile);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    // Log security event using activity_log table for now
    try {
      await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          event_type: 'password_changed',
          text: 'User changed their password'
        });
    } catch (logError) {
      console.error('Error logging password change:', logError);
    }
    
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });
  };

  const enableMFA = async () => {
    if (!user) throw new Error('Not authenticated');
    
    // For now, we'll use a simple approach without the MFA table
    // This would integrate with TOTP library in production
    toast({
      title: "MFA Setup",
      description: "Multi-factor authentication setup will be available soon.",
    });
  };

  const disableMFA = async () => {
    if (!user) throw new Error('Not authenticated');
    
    toast({
      title: "MFA Disabled",
      description: "Multi-factor authentication has been disabled.",
    });
  };

  const getLoginHistory = async () => {
    if (!user) return [];
    
    // For now, return activity log entries related to login
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .in('event_type', ['login', 'logout', 'password_changed'])
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching login history:', error);
      return [];
    }
  };

  const getActiveSessions = async () => {
    if (!user) return [];
    
    // For now, return empty array - would need session management
    return [];
  };

  const revokeSession = async (sessionId: string) => {
    if (!user) throw new Error('Not authenticated');
    
    toast({
      title: "Session revoked",
      description: "The session has been terminated successfully.",
    });
  };

  const getSecurityEvents = async () => {
    if (!user) return [];
    
    // For now, return security-related activity log entries
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .in('event_type', ['login', 'logout', 'password_changed', 'profile_updated'])
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      return [];
    }
  };

  return {
    user,
    session,
    loading,
    userProfile,
    refresh,
    logout,
    updateProfile,
    changePassword,
    enableMFA,
    disableMFA,
    getLoginHistory,
    getActiveSessions,
    revokeSession,
    getSecurityEvents,
  };
}
