import { useSearchParams } from "react-router-dom";
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
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { toast } = useToast();

  useEffect(() => {
    const cleanupSession = async () => {
      try {
        console.log('🧹 Auth Page - Starting session cleanup...');
        
        // Clear any existing auth data from localStorage
        localStorage.removeItem('supabase.auth.token');
        console.log('🗑️ Auth Page - Cleared local storage auth token');
        
        // Sign out to ensure clean state
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('❌ Auth Page - Error during sign out:', signOutError);
          toast({
            title: "Error",
            description: "Failed to clean up session. Please try again.",
            variant: "destructive",
          });
          return;
        }
        console.log('✅ Auth Page - Successfully signed out');

        // Get current session to verify cleanup
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('✅ Auth Page - Session successfully cleaned up');
        } else {
          console.warn('⚠️ Auth Page - Session still exists after cleanup');
        }
      } catch (err) {
        console.error('❌ Auth Page - Error cleaning up session:', err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    console.log('🔄 Auth Page - Initial render with params:', { inviteThesisId, inviteRole });
    cleanupSession();
  }, [toast]);

  console.log('📝 Auth Page - Rendering auth component with error:', error);

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