import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ProfileService } from '@/services/profileService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isTokenValid: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'azure') => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('🔍 useAuth called - context:', !!context, 'AuthContext:', AuthContext);
  if (context === undefined) {
    console.error('❌ AuthContext is undefined - component may be outside AuthProvider');
    console.error('❌ React context value:', context);
    console.error('❌ AuthContext object:', AuthContext);
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🏗️ AuthProvider: Component mounting');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);
  console.log('🏗️ AuthProvider: State initialized');

  useEffect(() => {
    let isMounted = true;
    let refreshTimer: NodeJS.Timeout;

    // Check token validity
    const checkTokenValidity = (session: Session | null) => {
      if (!session?.access_token) {
        setIsTokenValid(false);
        return false;
      }

      try {
        const payload = JSON.parse(atob(session.access_token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        // Token is invalid if it expires within the next 5 minutes
        const isValid = timeUntilExpiry > 5 * 60 * 1000;
        setIsTokenValid(isValid);
        
        // Set up refresh timer if token is still valid but expiring soon
        if (isValid && timeUntilExpiry < 15 * 60 * 1000) {
          refreshTimer = setTimeout(() => {
            refreshSession();
          }, Math.max(0, timeUntilExpiry - 60 * 1000)); // Refresh 1 minute before expiry
        }
        
        return isValid;
      } catch (error) {
        console.error('Error parsing token:', error);
        setIsTokenValid(false);
        return false;
      }
    };

    // Get initial session immediately
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          checkTokenValidity(session);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) {
          setIsTokenValid(false);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          checkTokenValidity(session);
          setLoading(false);
          
          // Handle profile creation for OAuth users
          if (event === 'SIGNED_IN' && session?.user) {
            setTimeout(async () => {
              try {
                await ProfileService.getOrCreateProfile(session.user.id, session.user);
              } catch (error) {
                console.error('Error handling user profile after sign in:', error);
              }
            }, 0);
          }

          // Clear session data on sign out
          if (event === 'SIGNED_OUT') {
            setIsTokenValid(false);
            if (refreshTimer) clearTimeout(refreshTimer);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      if (refreshTimer) clearTimeout(refreshTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    // Note: Email confirmation should be disabled in Supabase dashboard
    // Authentication > Settings > Enable email confirmations = OFF
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metadata
      }
    });

    // Create demo data assignment for new user
    if (data.user && !error) {
      const { DemoDataService } = await import('@/services/demoDataService');
      await DemoDataService.createDemoDataAssignment(data.user.id, email);
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'azure') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/admin`
      }
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    return { error };
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const refreshUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session) {
        setSession(session);
        setUser(session.user);
        setIsTokenValid(true);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setIsTokenValid(false);
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (session) {
        setSession(session);
        setUser(session.user);
        setIsTokenValid(true);
        return true;
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setIsTokenValid(false);
      // If refresh fails, sign out to clear invalid state
      await supabase.auth.signOut();
    }
    return false;
  };

  const value = {
    user,
    session,
    loading,
    isTokenValid,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    resetPassword,
    updatePassword,
    resendConfirmation,
    refreshUser,
    refreshSession,
  };

  console.log('🏗️ AuthProvider: Providing context value:', !!value);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};