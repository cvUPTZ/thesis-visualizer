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

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('🔄 Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      console.log('✅ Sign in successful');
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      navigate('/dashboard');
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
    isLoading: isLoading || signInMutation.isPending || signOutMutation.isPending,
    isAuthenticated: authData?.isAuthenticated ?? false,
    signIn: (email: string, password: string) => 
      signInMutation.mutate({ email, password }),
    signOut: () => signOutMutation.mutate(),
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};