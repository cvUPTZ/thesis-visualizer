import { useSearchParams, useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { AuthLoader } from "@/components/auth/AuthLoader";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useEffect } from "react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { isChecking } = useAuthStatus();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('✅ User is authenticated, redirecting to dashboard');
        navigate('/');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('🔄 Auth state changed: SIGNED_IN, redirecting to dashboard');
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isChecking) {
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {inviteThesisId ? 'Accept Collaboration Invitation' : 'Welcome to Thesis Visualizer'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;