import { useSearchParams, useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { DemoLogin } from "@/components/auth/DemoLogin";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const [emailAuthEnabled] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    let sessionCheckComplete = false;
    console.log('🔍 Auth Page - Checking session...');

    // Set a maximum loading time of 4 seconds
    const timeoutId = setTimeout(() => {
      if (mounted && !sessionCheckComplete) {
        console.log('⌛ Auth check timeout reached (4s)');
        setIsLoading(false);
      }
    }, 4000);

    const checkSession = async () => {
      try {
        console.log('🔍 Checking for active session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session check error:', sessionError);
          throw sessionError;
        }
        
        if (session?.user) {
          console.log('✅ Active session found, redirecting to dashboard');
          setAuthSuccess(true);
          if (mounted) {
            setTimeout(() => {
              navigate('/dashboard');
            }, 1000); // Short delay to show success message
          }
        }
      } catch (err: any) {
        console.error('❌ Error checking session:', err);
        if (mounted) {
          setAuthError(err.message);
        }
      } finally {
        if (mounted) {
          sessionCheckComplete = true;
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        setAuthSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Short delay to show success message
      }
    });

    checkSession();

    return () => {
      console.log('🧹 Auth Page - Cleaning up...');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {inviteThesisId ? 'Accept Collaboration Invitation' : 'Welcome to Thesis Visualizer'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Alert className="mb-4">
              <AlertDescription>
                Email authentication is currently disabled. Please use the demo account below.
              </AlertDescription>
            </Alert>
          ) : (
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#2563eb',
                      brandAccent: '#1d4ed8',
                    },
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin + '/auth'}
            />
          )}
          <AuthDivider />
          <DemoLogin />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;