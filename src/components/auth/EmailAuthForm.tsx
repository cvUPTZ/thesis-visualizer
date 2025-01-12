import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: () => void;
  onError: (error: AuthError) => void;
}

export const EmailAuthForm = ({ mode, onModeChange, onError }: EmailAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'supervisor'>('student');
  const [loading, setLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
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
      console.log('🔐 Attempting auth:', mode, { email });
      
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              user_type: userType
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account before signing in.",
        });
      }
      
      console.log('✅ Auth successful');
      
    } catch (error) {
      console.error('❌ Auth error:', error);
      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          toast({
            title: "Too many attempts",
            description: "Please wait a moment before trying again",
            variant: "destructive",
          });
        } else if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Authentication Failed",
            description: mode === 'signin' 
              ? "Invalid email or password. Please check your credentials and try again."
              : "Unable to create account. Please try again.",
            variant: "destructive",
          });
        } else {
          onError(error as AuthError);
        }
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
      
      {mode === 'signup' && (
        <div>
          <Select 
            value={userType} 
            onValueChange={(value: 'student' | 'supervisor') => setUserType(value)}
            disabled={loading}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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