import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: () => void;
}

export const EmailAuthForm = ({ mode, onModeChange }: EmailAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(`🔐 Attempting to ${mode} with email:`, email);

    try {
      let response;
      if (mode === 'signup') {
        response = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              email: email,
            }
          }
        });
        
        console.log('📧 Signup response:', response);
        
        if (response.error) {
          throw response.error;
        }
        
        if (response.data?.user?.identities?.length === 0) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      } else {
        // Clear any existing session data before attempting to sign in
        await supabase.auth.signOut({ scope: 'local' });
        
        console.log('🔑 Attempting signin with:', { email });
        response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        console.log('🔑 Signin response:', JSON.stringify(response, null, 2));
        
        if (response.error) {
          console.log('❌ Error during signin:', response.error);
          
          if (response.error.message === 'Invalid login credentials' || 
              response.error.message.includes('invalid_credentials')) {
            toast({
              title: "Invalid Credentials",
              description: "The email or password you entered is incorrect. Please try again.",
              variant: "destructive",
            });
            return;
          } else if (response.error.message.includes('Email not confirmed')) {
            toast({
              title: "Email Not Verified",
              description: "Please check your email and verify your account before signing in.",
              variant: "destructive",
            });
            return;
          }
          
          throw response.error;
        }
        
        if (!response.data?.user) {
          console.log('❌ No user data in response');
          toast({
            title: "Error",
            description: "Failed to sign in. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('✅ Signin successful:', response.data.user.email);
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
      }
    } catch (error: any) {
      console.error(`❌ Error during ${mode}:`, error);
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
    <div className="space-y-6">
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
              required
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
              required
              minLength={6}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-light"
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
      
      <div className="text-center">
        <Button
          variant="link"
          onClick={onModeChange}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {mode === 'signin' ? (
            "Don't have an account? Sign up"
          ) : (
            'Already have an account? Sign in'
          )}
        </Button>
      </div>
    </div>
  );
};