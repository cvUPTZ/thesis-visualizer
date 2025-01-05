import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthMutations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log('🔄 Starting sign out process...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ Sign out successful');
    },
    onSuccess: () => {
      console.log('🧹 Cleaning up after successful sign out...');
      queryClient.clear();
      toast({
        title: "Signed out",
        description: "Successfully signed out.",
      });
      navigate('/auth');
      
      // Add a small delay before reload to ensure navigation and toast are visible
      setTimeout(() => {
        console.log('🔄 Reloading page after sign out...');
        window.location.reload();
      }, 1000);
    },
    onError: (error: Error) => {
      console.error('❌ Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    signOut: () => signOutMutation.mutateAsync()
  };
};