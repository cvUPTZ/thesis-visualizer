import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: () => void;
  onError: (error: AuthError) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const EmailAuthForm = ({ 
  mode, 
  onModeChange, 
  onError,
  isLoading,
  setLoading 
}: EmailAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        onError(error);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Auth error:', err);
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
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
          disabled={isLoading}
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </Button>
      </div>
    </form>
  );
};