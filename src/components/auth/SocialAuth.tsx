import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, Provider } from '@supabase/supabase-js';
import { Github, Loader2 } from 'lucide-react';

interface SocialAuthProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  onError: (error: AuthError) => void;
}

export const SocialAuth = ({ isLoading, setLoading, onError }: SocialAuthProps) => {
  const handleSocialLogin = async (provider: Provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        onError(error);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Social auth error:', err);
        onError(err as AuthError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
        onClick={() => handleSocialLogin('github')}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        Continue with GitHub
      </Button>
    </div>
  );
};