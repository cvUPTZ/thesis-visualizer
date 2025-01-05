import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthMutations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      
      // Update auth state
      queryClient.setQueryData(['auth-session'], {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.userRole,
        },
        isAuthenticated: true,
      });

      // First navigate
      const destination = data.userRole === 'admin' ? '/admin' : '/dashboard';
      console.log('🚀 Navigating to:', destination);
      navigate(destination);
      
      // Show toast
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });

      // Force a page reload after navigation and toast
      console.log('⏳ Setting up page reload...');
      setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload();
      }, 2000); // Increased to 2 seconds to ensure everything completes
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
      queryClient.clear();
      queryClient.setQueryData(['auth-session'], { 
        user: null, 
        isAuthenticated: false 
      });
      
      toast({
        title: "Signed out",
        description: "Successfully signed out.",
      });
      
      navigate('/');
      
      setTimeout(() => {
        console.log('🔄 Reloading page after sign out...');
        window.location.reload();
      }, 500);
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

  return {
    signIn: (email: string, password: string) => signInMutation.mutateAsync({ email, password }),
    signOut: () => signOutMutation.mutateAsync(),
    signInError: signInMutation.error?.message || null,
  };
};