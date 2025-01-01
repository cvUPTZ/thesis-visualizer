import { useSearchParams, useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const cleanupSession = async () => {
      try {
        console.log('Cleaning up session state...');
        localStorage.removeItem('supabase.auth.token');
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
    
    cleanupSession();
  }, [toast]);

  const handleBack = () => {
    navigate("/");
  };

  const togglePassword = () => {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
      input.type = showPassword ? 'password' : 'text';
    });
    setShowPassword(!showPassword);
  };

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
          <div className="relative">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-[6.5rem] right-3 h-8 w-8 p-0"
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <button 
            onClick={handleBack} 
            className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-md text-center hover:bg-gray-300"
          >
            Retour
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;