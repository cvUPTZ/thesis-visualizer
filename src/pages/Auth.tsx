import { useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { toast } = useToast();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Handle redirection for authenticated users
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, loading });
    if (isAuthenticated && !loading) {
      console.log('User is authenticated, redirecting to home');
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Clean up session when not authenticated
  useEffect(() => {
    const cleanupSession = async () => {
      try {
        console.log('Cleaning up session state...');
        
        // Clear any existing auth data from localStorage
        localStorage.removeItem('supabase.auth.token');
        
        // Sign out to ensure clean state
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Error during sign out:', signOutError);
          toast({
            title: "Error",
            description: "Failed to clean up session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Get current session to verify cleanup
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('Session successfully cleaned up');
        }
      } catch (err) {
        console.error('Error cleaning up session:', err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    if (!isAuthenticated && !loading) {
      console.log('User not authenticated, cleaning up session');
      cleanupSession();
    }
  }, [toast, isAuthenticated, loading]);

  // Show loading state while checking authentication
  if (loading) {
    console.log('Loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Don't show auth form if already authenticated
  if (isAuthenticated) {
    console.log('User is authenticated, returning null');
    return null;
  }

  console.log('Rendering auth form');
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