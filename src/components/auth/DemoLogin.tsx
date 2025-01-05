import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const DemoLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleDemoLogin = async () => {
    try {
      console.log('🔑 Starting demo login process...');
      
      // Try to get user by email first
      const { data: userData, error: userError } = await supabase.auth.admin
        .getUserByEmail('demo.user@thesisvisualizer.com');
      
      if (userError || !userData) {
        console.log('🆕 Demo user not found, creating account...');
        // Create new demo account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'demo.user@thesisvisualizer.com',
          password: 'demo123456',
          options: {
            data: {
              email: 'demo.user@thesisvisualizer.com'
            }
          }
        });

        if (signUpError) {
          console.error('❌ Demo signup error:', signUpError);
          throw signUpError;
        }

        toast({
          title: "Demo Account Created",
          description: "You can now use the demo account to explore the app.",
        });
      }

      // Sign in with demo credentials
      console.log('🔑 Attempting demo login...');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo.user@thesisvisualizer.com',
        password: 'demo123456'
      });

      if (signInError) {
        console.error('❌ Demo login error:', signInError);
        throw signInError;
      }

      console.log('✅ Demo login successful');
      toast({
        title: "Demo Login Successful",
        description: "You're now logged in as a demo user.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Error in demo login:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to login with demo account",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleDemoLogin}
    >
      Try Demo Account
    </Button>
  );
};