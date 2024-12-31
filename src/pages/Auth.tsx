import { useSearchParams, useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          navigate('/create-thesis');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };

    const cleanupSession = async () => {
      try {
        console.log('Cleaning up session state...');
        localStorage.removeItem('supabase.auth.token');
        
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError && mounted) {
          console.error('Error during sign out:', signOutError);
          toast({
            title: "Error",
            description: "Failed to clean up session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session && mounted) {
          console.log('Session successfully cleaned up');
        }
      } catch (err) {
        if (mounted) {
          console.error('Error cleaning up session:', err);
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    checkAndRedirect();
    cleanupSession();

    return () => {
      mounted = false;
    };
  }, [toast, navigate]);

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
            redirectTo={`${window.location.origin}/create-thesis`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;