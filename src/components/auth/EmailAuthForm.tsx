import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: () => void;
  onError: (error: AuthError) => void;
}

export const EmailAuthForm = ({ mode, onModeChange, onError }: EmailAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if enough time has passed since last attempt (3 seconds)
    const now = Date.now();
    if (now - lastAttempt < 3000) {
      toast({
        title: "Please wait",
        description: "Please wait a few seconds before trying again",
        variant: "destructive",
      });
      return;
    }
    
    setLastAttempt(now);
    setLoading(true);

    try {
      console.log('🔐 Attempting auth:', mode);
      const { error } = mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('❌ Auth error:', error);
        
        // Handle rate limiting specifically
        if (error.message.includes('rate limit')) {
          toast({
            title: "Too many attempts",
            description: "Please wait a moment before trying again",
            variant: "destructive",
          });
        } else {
          onError(error);
        }
      } else {
        console.log('✅ Auth successful');
        if (mode === 'signup') {
          toast({
            title: "Success",
            description: "Please check your email to verify your account",
          });
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('❌ Unexpected auth error:', err);
        onError(err as AuthError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
          disabled={loading}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'signin' ? 'Signing in...' : 'Signing up...'}
          </>
        ) : (
          mode === 'signin' ? 'Sign In' : 'Sign Up'
        )}
      </Button>
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          className="text-[#9b87f5]"
          onClick={onModeChange}
          disabled={loading}
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </Button>
      </div>
    </form>
  );
};