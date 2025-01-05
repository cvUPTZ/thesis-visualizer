// providers/AuthContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
};

type Profile = {
  email: string;
  roles: {
    name: string;
  } | null;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        return { user: null, isAuthenticated: false };
      }

      try {
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
        console.error('Profile fetch error:', error);
        return { user: null, isAuthenticated: false };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

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
        userRole: (profile as Profile).roles?.name || null 
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      navigate(data.userRole === 'admin' ? '/admin' : '/dashboard');
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sign in error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
      navigate('/');
      toast({
        title: "Signed out",
        description: "Successfully signed out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sign out error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
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
    isLoading,
    isAuthenticated: authData?.isAuthenticated ?? false,
    signIn: (email: string, password: string) => signInMutation.mutateAsync({ email, password }),
    signOut: () => signOutMutation.mutateAsync(),
    refreshSession: () => queryClient.invalidateQueries({ queryKey: ['auth-session'] }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};