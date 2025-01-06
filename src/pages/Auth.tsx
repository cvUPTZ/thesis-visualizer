import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
      <div className="bg-white/5 p-8 rounded-xl border border-white/10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
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
    </div>
  );
};

export default Auth;