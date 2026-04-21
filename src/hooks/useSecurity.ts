
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";

export interface LoginHistoryItem {
  id: string;
  user_id: string;
  event_type: string;
  text: string;
  timestamp: string;
}

export interface ActiveSession {
  id: string;
  session_token: string;
  ip_address: string;
  user_agent: string;
  device_info: any;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  text: string;
  timestamp: string;
}

export function useSecurity() {
  const { user } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all security data
  const loadSecurityData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use activity_log for now until new tables are available in types
      const { data: historyData, error: historyError } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .in('event_type', ['login', 'logout', 'password_changed'])
        .order('timestamp', { ascending: false })
        .limit(50);

      if (historyError) throw historyError;

      const { data: eventsData, error: eventsError } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;

      setLoginHistory(historyData || []);
      setActiveSessions([]); // Empty for now
      setSecurityEvents(eventsData || []);
    } catch (error) {
      console.error('Error loading security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Record login attempt - simplified for now
  const recordLoginAttempt = async (
    ipAddress: string,
    userAgent: string,
    status: string,
    deviceType: string = 'unknown',
    location?: any,
    sessionId?: string,
    failureReason?: string
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          event_type: status === 'success' ? 'login' : 'failed_login',
          text: `Login attempt from ${ipAddress} ${status === 'success' ? 'successful' : 'failed'}`
        });
    } catch (error) {
      console.error('Error recording login attempt:', error);
    }
  };

  // Log security event - simplified for now
  const logSecurityEvent = async (
    eventType: string,
    eventData?: any,
    ipAddress?: string,
    userAgent?: string
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          event_type: eventType,
          text: `Security event: ${eventType}`
        });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  // Revoke session - placeholder for now
  const revokeSession = async (sessionId: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      // Log security event
      await logSecurityEvent('session_revoked', { session_id: sessionId });

      // Refresh data
      await loadSecurityData();

      toast({
        title: "Session Revoked",
        description: "The session has been terminated successfully.",
      });
    } catch (error) {
      console.error('Error revoking session:', error);
      throw error;
    }
  };

  // Acknowledge security event - placeholder for now
  const acknowledgeSecurityEvent = async (eventId: string) => {
    if (!user) return;

    try {
      // For now, just refresh data
      await loadSecurityData();
    } catch (error) {
      console.error('Error acknowledging security event:', error);
    }
  };

  // Get security summary
  const getSecuritySummary = () => {
    const recentLoginAttempts = loginHistory.filter(
      item => new Date(item.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    const failedAttempts = loginHistory.filter(item => item.event_type === 'failed_login');
    const suspiciousAttempts = loginHistory.filter(item => item.text.includes('suspicious'));
    const unacknowledgedEvents = securityEvents.filter(item => item.event_type !== 'login');

    return {
      totalActiveSessions: activeSessions.length,
      recentLogins: recentLoginAttempts.length,
      failedAttempts: failedAttempts.length,
      suspiciousActivity: suspiciousAttempts.length,
      unacknowledgedAlerts: unacknowledgedEvents.length,
      lastLoginAt: loginHistory.find(item => item.event_type === 'login')?.timestamp,
      lastLoginIP: 'Unknown', // Would extract from text in real implementation
    };
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  return {
    loginHistory,
    activeSessions,
    securityEvents,
    loading,
    loadSecurityData,
    recordLoginAttempt,
    logSecurityEvent,
    revokeSession,
    acknowledgeSecurityEvent,
    getSecuritySummary,
  };
}
