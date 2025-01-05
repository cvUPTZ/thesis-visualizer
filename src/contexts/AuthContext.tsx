import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from './auth/useSession';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

interface AuthContextType {
  userId: string | null;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const {
    userId,
    userRole,
    loading,
    handleSessionChange,
    logout
  } = useSession();

  useEffect(() => {
    console.log('🔄 Initializing auth context...');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          await handleSessionChange(session);
          setInitialLoadComplete(true);
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
      subscription.unsubscribe();
    };
  }, [handleSessionChange]);

  if (!initialLoadComplete || loading) {
    return <LoadingSkeleton />;
  }

  const value = {
    userId,
    userRole,
    loading,
    logout
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