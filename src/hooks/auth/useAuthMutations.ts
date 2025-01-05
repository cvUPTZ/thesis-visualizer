import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

export const useAuthMutations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
        try {
            await authService.signIn(email, password);
        } catch(error: any) {
          console.error('❌ Sign in error:', error);
            toast({
              title: "Error signing in",
                description: error.message,
                variant: "destructive",
            });
             throw error;
        }

      
    },
    onSuccess: () => {
        console.log('✅ Sign in successful, invalidating queries');
        queryClient.invalidateQueries({ queryKey: ['auth-session'] });
        navigate('/dashboard');

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
      queryClient.clear();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Sign out error:', error);
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