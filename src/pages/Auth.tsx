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

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get("error");
  const { toast } = useToast();
  
  const [emailAuthEnabled] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        console.log('🔍 Checking for active session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          if (mounted) {
            setAuthError(sessionError.message);
            toast({
              title: "Authentication Error",
              description: sessionError.message,
              variant: "destructive",
            });
          }
          return;
        }
        
        if (session?.user) {
          console.log('✅ Active session found, redirecting to dashboard');
          setAuthSuccess(true);
          toast({
            title: "Welcome Back!",
            description: "You're already signed in. Redirecting to dashboard...",
          });
          if (mounted) {
            setTimeout(() => {
              navigate('/dashboard');
            }, 1000); // Short delay to show success message
          }
        } else {
          toast({
            title: "Welcome",
            description: "Please sign in or create an account to continue.",
          });
        }
      } catch (err: any) {
        console.error('❌ Error checking session:', err);
        if (mounted) {
          setAuthError(err.message);
          toast({
            title: "Error",
            description: "There was a problem checking your session. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Set a timeout to stop loading after 4 seconds
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('⚠️ Session check timeout reached');
        setIsLoading(false);
        toast({
          title: "Session Check Timeout",
          description: "The session check took too long. Please try again.",
          variant: "destructive",
        });
      }
    }, 4000);

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        setAuthSuccess(true);
        toast({
          title: "Successfully Signed In",
          description: "Welcome to Thesis Visualizer!",
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Short delay to show success message
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Checking authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
          {authSuccess && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Successfully authenticated! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          {!emailAuthEnabled ? (
            <DemoLogin />
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;