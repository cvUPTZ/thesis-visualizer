import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
}

export const EmailAuthForm = ({ mode }: EmailAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(`Attempting to ${mode} with email:`, email);

    try {
      let response;
      if (mode === 'signup') {
        response = await supabase.auth.signUp({
          email,
          password,
        });
        if (response.error) throw response.error;
        
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      } else {
        response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (response.error) throw response.error;
        
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
      }
    } catch (error: any) {
      console.error(`Error during ${mode}:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-primary"
        disabled={loading}
      >
        {loading ? (
          'Loading...'
        ) : mode === 'signin' ? (
          'Sign In'
        ) : (
          'Sign Up'
        )}
      </Button>
    </form>
  );
};