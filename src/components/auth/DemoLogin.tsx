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
      
      // Try to sign in with demo credentials first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo.user@thesisvisualizer.com',
        password: 'demo123456'
      });

      if (signInError) {
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

        // Try to sign in again after creating the account
        const { error: secondSignInError } = await supabase.auth.signInWithPassword({
          email: 'demo.user@thesisvisualizer.com',
          password: 'demo123456'
        });

        if (secondSignInError) {
          console.error('❌ Second sign in attempt failed:', secondSignInError);
          throw secondSignInError;
        }

        toast({
          title: "Demo Account Created",
          description: "You can now use the demo account to explore the app.",
        });
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