// AuthProvider.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, User } from '@/types/auth';

type SignInResponse = {
  user: User;
  userRole: string;
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
      console.log('🔄 Fetching auth session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error fetching session:', error);
        return { user: null, isAuthenticated: false };
      }

      if (!session?.user) {
        console.log('ℹ️ No active session');
        return { user: null, isAuthenticated: false };
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            email,
            roles (
              name
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        const user: User = {
          id: session.user.id,
          email: (profile as Profile).email,
          role: (profile as Profile).roles?.name || null,
        };

        console.log('✅ Session loaded:', user);
        return { user, isAuthenticated: true };
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        return { user: null, isAuthenticated: false };
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const signInMutation = useMutation<SignInResponse, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      console.log('🔄 Attempting to sign in user:', email);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          roles (
            name
          )
        `)
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return { 
        user: data.user,
        userRole: (profile as Profile).roles?.name || null 
      };
    },
    onSuccess: (data) => {
      console.log('✅ Sign in successful, user role:', data.userRole);
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      
      // Handle role-based navigation
      if (data.userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    },
    onError: (error) => {
      console.error('❌ Sign in error:', error);
      toast({
        title: "Error signing in",
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

  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log('🔄 Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('✅ Sign out successful');
      queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const refreshSession = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['auth-session'] });
    } catch (error) {
      console.error('Failed to refresh session:', error);
      toast({
        title: "Error refreshing session",
        description: "Failed to refresh your session",
        variant: "destructive",
      });
    }
  };

  const value: AuthContextType = {
    user: authData?.user ?? null,
    userId: authData?.user?.id ?? null,
    userEmail: authData?.user?.email ?? null,
    userRole: authData?.user?.role ?? null,
    isLoading,
    isAuthenticated: authData?.isAuthenticated ?? false,
    signIn: async (email: string, password: string) => {
      await signInMutation.mutateAsync({ email, password });
    },
    signOut: async () => {
      await signOutMutation.mutateAsync();
    },
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};