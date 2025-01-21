import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  handleLogout: () => Promise<void>;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  session: null,
  user: null,
  handleLogout: async () => {},
  userId: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          // Check if session is expired or about to expire (within 5 minutes)
          const expiresAt = new Date(currentSession.expires_at! * 1000);
          const now = new Date();
          const fiveMinutes = 5 * 60 * 1000;
          
          if (expiresAt.getTime() - now.getTime() < fiveMinutes) {
            // Attempt to refresh the session
            const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
            if (error) {
              await handleLogout();
              return;
            }
            setSession(refreshedSession);
          } else {
            setSession(currentSession);
          }
        }
        setLoading(false);
      } catch {
        setSession(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      } else {
        setSession(currentSession);
      }
      setLoading(false);
    });

    // Set up periodic session check (every 4 minutes)
    const sessionCheckInterval = setInterval(async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        const expiresAt = new Date(currentSession.expires_at! * 1000);
        const now = new Date();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (expiresAt.getTime() - now.getTime() < fiveMinutes) {
          await supabase.auth.refreshSession();
        }
      }
    }, 4 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch {
      // Silent fail - user is logged out anyway
      setSession(null);
    }
  };

  const value = {
    isAuthenticated: !!session,
    loading,
    session,
    user: session?.user ?? null,
    handleLogout,
    userId: session?.user?.id ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};