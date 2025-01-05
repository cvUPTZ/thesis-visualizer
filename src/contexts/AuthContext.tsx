import React, { createContext, useContext } from 'react';
import type { AuthContextType } from '@/types/auth';
import { useAuthSession } from '@/hooks/auth/useAuthSession';
import { useAuthMutations } from '@/hooks/auth/useAuthMutations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: authData, isLoading } = useAuthSession();
  const { signIn, signOut } = useAuthMutations();

  const value: AuthContextType = {
    user: authData?.user ?? null,
    userId: authData?.user?.id ?? null,
    userEmail: authData?.user?.email ?? null,
    userRole: authData?.user?.role ?? null,
    isLoading,
    isAuthenticated: authData?.isAuthenticated ?? false,
    signIn,
    signOut,
    refreshSession: async () => {
      // Implement if needed
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
