import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Github, Mail } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('🔐 Attempting login with email:', email);
      
      if (!email || !password) {
        toast({
          title: "Validation Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Login successful');
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('❌ Unexpected error during login:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      console.log('📝 Attempting signup with email:', email);
      
      if (!email || !password) {
        toast({
          title: "Validation Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('❌ Signup error:', error);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Signup successful');
      toast({
        title: "Success",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      console.error('❌ Unexpected error during signup:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('🔐 Attempting Google sign in...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('❌ Google sign in error:', error);
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1F2C] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-4 h-4 mr-2"
            />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A1F2C] px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                leftIcon={<Mail className="w-4 h-4 text-white/50" />}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-4">
              <Button 
                type="submit"
                className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign In'}
              </Button>
              <Button 
                type="button"
                onClick={handleSignUp}
                variant="outline"
                className="w-full bg-transparent border-[#9b87f5] text-white hover:bg-[#9b87f5]/20"
                disabled={loading}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#9b87f5] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#9b87f5] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;