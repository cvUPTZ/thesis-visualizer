import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';

export const useAuthMutations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('🔄 Attempting to sign in user:', email);
      
      if (!email || !password) {
        console.error('❌ Email and password are required');
        throw new Error('Email and password are required');
      }

      try {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('❌ Sign in error:', signInError);
          if (signInError.message === 'Invalid login credentials') {
            throw new Error('Invalid email or password');
          }
          throw signInError;
        }

        if (!authData.user) {
          console.error('❌ No user data returned');
          throw new Error('Authentication failed');
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            roles (
              name
            )
          `)
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('❌ Error fetching user role:', profileError);
          throw profileError;
        }

        const user: User = {
          id: authData.user.id,
          email: authData.user.email,
          role: profile.roles?.name || null
        };

        console.log('✅ Sign in successful, user role:', profile.roles?.name);
        return { user, session: authData.session, userRole: profile.roles?.name };
      } catch (error) {
        console.error('❌ Authentication error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Sign in successful, redirecting based on role:', data.userRole);
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      
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

  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log('🔄 Signing out user...');
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear React Query cache
        queryClient.clear();
        
        console.log('✅ Sign out successful');
      } catch (error) {
        console.error('❌ Error during sign out:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Reset auth state
      queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Sign out error:', error);
      // Even if there's an error, we want to clear local state
      queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
      navigate('/');
      toast({
        title: "Error during sign out",
        description: "You have been signed out, but there was an error. Please refresh the page.",
        variant: "destructive",
      });
    },
  });

  return {
    signIn: (email: string, password: string) => signInMutation.mutateAsync({ email, password }),
    signOut: () => signOutMutation.mutateAsync(),
  };
};