import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, User } from '@/types/auth';

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

  // Session management with React Query
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

      // Fetch user role from profiles table
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

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        return { user: null, isAuthenticated: false };
      }

      const user: User = {
        id: session.user.id,
        email: profile.email,
        role: profile.roles?.name || null,
      };

      console.log('✅ Session loaded:', user);
      return { user, isAuthenticated: true };
    },
    staleTime: 1000 * 60 * 5, // Consider session data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });

  // Sign in mutation with role-based redirection
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('🔄 Attempting to sign in user:', email);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      // Fetch user role immediately after successful sign in
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          roles (
            name
          )
        `)
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user role:', profileError);
        throw profileError;
      }

      return { ...data, userRole: profile.roles?.name };
    },
    onSuccess: (data) => {
      console.log('✅ Sign in successful, user role:', data.userRole);
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      
      // Role-based redirection
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
    onError: (error: Error) => {
      console.error('❌ Sign in error:', error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sign out mutation
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

  // Session refresh function
  const refreshSession = async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth-session'] });
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
    logout: async () => {
      await signOutMutation.mutateAsync();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};