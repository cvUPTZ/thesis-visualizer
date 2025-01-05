import React, { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthQueries } from '@/hooks/auth/useAuthQueries';
import { useAuthMutations } from '@/hooks/auth/useAuthMutations';

type User = {
  id: string;
  email: string;
  role: string | null;
};

type AuthContextType = {
  user: User | null;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signInError: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: authData, isLoading: initialLoading } = useAuthQueries();
  const { signIn, signOut, signInError } = useAuthMutations();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
        queryClient.clear();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [queryClient]);

  const value: AuthContextType = {
    user: authData?.user ?? null,
    userId: authData?.user?.id ?? null,
    userEmail: authData?.user?.email ?? null,
    userRole: authData?.user?.role ?? null,
    isLoading: initialLoading,
    isAuthenticated: authData?.isAuthenticated ?? false,
    signIn,
    signOut,
    refreshSession: () => queryClient.invalidateQueries({ queryKey: ['auth-session'] }),
    signInError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};