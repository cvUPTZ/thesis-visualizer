import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DemoLogin } from "@/components/auth/DemoLogin";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthLoader } from "@/components/auth/AuthLoader";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get("error");
  const { toast } = useToast();
  
  const [emailAuthEnabled] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    console.log('🔍 Checking auth state...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        setIsAuthenticating(true);
        toast({
          title: "Successfully Signed In",
          description: "Welcome to Thesis Visualizer!",
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Short delay to show success message
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isAuthenticating) {
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          {(error || authError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error || authError}</AlertDescription>
            </Alert>
          )}
          {emailAuthEnabled ? (
            <>
              <SupabaseAuth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                redirectTo={`${window.location.origin}/auth/callback`}
              />
              <AuthDivider />
              <DemoLogin />
            </>
          ) : (
            <DemoLogin />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;