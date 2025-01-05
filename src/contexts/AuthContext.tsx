import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useSession } from './auth/useSession';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  userId: string | null;
  userEmail: string | null;
  session: Session | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    userRole,
    setUserRole,
    loading: isLoading,
    setLoading,
    handleSessionChange,
    logout
  } = useSession();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('🔄 AuthProvider - Initializing');
    
    // Clear cache on page reload
    const clearCacheOnReload = () => {
      console.log('🧹 Clearing cache on page reload');
      localStorage.clear();
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', clearCacheOnReload);

    const initializeAuth = async () => {
      try {
        console.log('🔄 Checking initial session...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('📡 Initial session:', initialSession?.user?.email);
        
        if (initialSession) {
          await handleSessionChange(initialSession);
          setSession(initialSession);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        toast({
          title: "Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('🔄 Auth state changed:', event, currentSession?.user?.email);
      if (currentSession) {
        await handleSessionChange(currentSession);
        setSession(currentSession);
      } else {
        setSession(null);
        setUserId(null);
        setUserEmail(null);
        setUserRole(null);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscriptions');
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', clearCacheOnReload);
    };
  }, [handleSessionChange, setLoading, setUserId, setUserEmail, setUserRole, toast]);

  const value = {
    isAuthenticated: !!session,
    isLoading,
    userRole,
    userId,
    userEmail,
    session,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};