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

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const [emailAuthEnabled] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          if (mounted) navigate('/dashboard');
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
        navigate('/dashboard');
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
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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