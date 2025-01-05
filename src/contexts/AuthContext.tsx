import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from './auth/useSession';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
import { AuthContextType } from './auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const {
    userId,
    userRole,
    loading,
    handleSessionChange,
    logout,
    userEmail,
    setUserId,
    setUserEmail,
    setUserRole,
    setLoading
  } = useSession();

  const isAuthenticated = !!userId;

  useEffect(() => {
    console.log('🔄 Initializing auth context...');
    
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          await handleSessionChange(session);
          // Add a small delay to prevent flash of loading state
          timeoutId = setTimeout(() => {
            setInitialLoadComplete(true);
          }, 500);
        }
      } catch (error) {
        console.error('❌ Error during auth initialization:', error);
        if (mounted) {
          setInitialLoadComplete(true);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      if (mounted) {
        await handleSessionChange(session);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [handleSessionChange]);

  // Only show loading state for initial load
  if (!initialLoadComplete) {
    return <LoadingSkeleton />;
  }

  const value: AuthContextType = {
    userId,
    userEmail,
    userRole,
    loading,
    isAuthenticated,
    logout,
    setUserId,
    setUserEmail,
    setUserRole,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};