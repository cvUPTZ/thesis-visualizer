import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DemoLogin = () => {
  const { toast } = useToast();
  
  const handleDemoLogin = async () => {
    try {
      console.log('🔑 Attempting demo login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo.user@thesisvisualizer.com',
        password: 'demo123456'
      });

      if (error) {
        console.log('❌ Demo login error:', error);
        if (error.message === 'Invalid login credentials') {
          console.log('🆕 Demo user not found, creating account...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'demo.user@thesisvisualizer.com',
            password: 'demo123456'
          });

          if (signUpError) {
            console.error('❌ Demo signup error:', signUpError);
            throw signUpError;
          }

          toast({
            title: "Demo Account Created",
            description: "You can now use the demo account to explore the app.",
          });
        } else {
          throw error;
        }
      } else {
        console.log('✅ Demo login successful');
        toast({
          title: "Demo Login Successful",
          description: "You're now logged in as a demo user.",
        });
      }
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