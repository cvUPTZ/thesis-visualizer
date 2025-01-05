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
  signInError: string | null;
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

  const { data: authData, isLoading: initialLoading } = useQuery({
    queryKey: ['auth-session-initial'],
    queryFn: async () => {
      console.log('🔄 Fetching initial auth session...');
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
        console.log('✅ Session found, fetching profile...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, roles (name)')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
          throw profileError;
        }

        const user: User = {
          id: session.user.id,
          email: (profile as Profile).email,
          role: (profile as Profile).roles?.name || null,
        };

        console.log('✅ Initial auth data loaded:', { user });
        return { user, isAuthenticated: true };
      } catch (error) {
        console.error('❌ Profile fetch error:', error);
        return { user: null, isAuthenticated: false };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('🔄 Attempting sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

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
    onSuccess: (data) => {
      console.log('✅ Sign in successful:', data);
      queryClient.setQueryData(['auth-session'], {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.userRole,
        },
        isAuthenticated: true,
      });
      navigate(data.userRole === 'admin' ? '/admin' : '/dashboard');
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      // Reload the page after successful sign-in
      window.location.reload();
    },
    onError: (error: Error) => {
      console.error('❌ Sign in mutation error:', error);
      queryClient.setQueryData(['auth-session'], {
        user: null,
        isAuthenticated: false,
      });
      toast({
        title: "Sign in error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log('🔄 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('✅ Sign out successful');
      // Clear all query cache
      queryClient.clear();
      // Reset auth state
      queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
      // Show success message
      toast({
        title: "Signed out",
        description: "Successfully signed out.",
      });
      // Navigate to home page
      navigate('/');
      // Force reload the page to clear all state
      window.location.reload();
    },
    onError: (error: Error) => {
      console.error('❌ Sign out error:', error);
      toast({
        title: "Sign out error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
    signIn: async (email: string, password: string) => {
      await signInMutation.mutateAsync({ email, password });
    },
    signOut: () => signOutMutation.mutateAsync(),
    refreshSession: () => queryClient.invalidateQueries({ queryKey: ['auth-session'] }),
    signInError: signInMutation.error?.message || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};