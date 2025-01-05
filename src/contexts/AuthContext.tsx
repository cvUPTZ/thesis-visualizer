import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Type Definitions
interface User {
  id: string;
  email: string;
  role: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface Profile {
  email: string;
  roles: { name: string } | null;
}

interface AuthContextType {
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
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom Hook for Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility Functions
const saveAuthState = (state: AuthState) => {
  sessionStorage.setItem('authState', JSON.stringify(state));
};

const clearAuthState = () => {
  sessionStorage.removeItem('authState');
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Initial Session Query
  const { data: authData, isLoading: initialLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session?.user) return { user: null, isAuthenticated: false };

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, roles (name)')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        const user: User = {
          id: session.user.id,
          email: (profile as Profile).email,
          role: (profile as Profile).roles?.name || null,
        };

        return { user, isAuthenticated: true };
      } catch (error) {
        console.error('Session fetch error:', error);
        return { user: null, isAuthenticated: false };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  // Sign In Mutation
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('roles (name)')
        .eq('id', data.user.id)
        .single();

      return {
        user: data.user,
        userRole: profile?.roles?.name || null
      };
    },
    onSuccess: async (data) => {
      const authState: AuthState = {
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: data.userRole,
        },
        isAuthenticated: true
      };

      // Save state before reload
      saveAuthState(authState);

      // Show toast and reload
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });

      // Redirect with reload
      const redirectPath = data.userRole === 'admin' ? '/admin' : '/dashboard';
      window.location.href = redirectPath;
    },
    onError: (error: Error) => {
      console.error('Sign in error:', error);
      clearAuthState();
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Sign Out Mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear auth state
      clearAuthState();
      queryClient.clear();

      // Show toast
      toast({
        title: "Signed out",
        description: "Successfully signed out.",
      });

      // Redirect with reload
      window.location.href = '/auth';
    },
    onError: (error: Error) => {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Auth State Change Listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        clearAuthState();
        queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [queryClient]);

  // Context Value
  const value: AuthContextType = {
    user: authData?.user ?? null,
    userId: authData?.user?.id ?? null,
    userEmail: authData?.user?.email ?? null,
    userRole: authData?.user?.role ?? null,
    isLoading: initialLoading,
    isAuthenticated: authData?.isAuthenticated ?? false,
    signIn: async (email: string, password: string) => {
      await signInMutation.mutateAsync({ email, password });
    },
    signOut: async () => {
      await signOutMutation.mutateAsync();
    },
    refreshSession: () => queryClient.invalidateQueries({ queryKey: ['auth-session'] }),
    signInError: signInMutation.error?.message || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};