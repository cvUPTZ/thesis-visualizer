import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SocialAuthProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SocialAuth = ({ isLoading, setLoading }: SocialAuthProps) => {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('🔐 Attempting Google sign in...');
      console.log('📍 Current origin:', window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('❌ Google sign in error:', error);
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Google sign in initiated:', data);
      
    } catch (error: any) {
      console.error('❌ Unexpected error during Google sign in:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <img 
        src="https://www.google.com/favicon.ico" 
        alt="Google" 
        className="w-4 h-4 mr-2"
      />
      Continue with Google
    </Button>
  );
};