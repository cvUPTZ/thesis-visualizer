import { useSearchParams, useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailAuthEnabled, setEmailAuthEnabled] = useState(true);

  const handleDemoLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@thesisvisualizer.com',
        password: 'demo123456'
      });

      if (error) {
        console.error('Demo login error:', error);
        if (error.message === 'Invalid login credentials') {
          // If demo user doesn't exist, create it
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'demo@thesisvisualizer.com',
            password: 'demo123456'
          });

          if (signUpError) {
            throw signUpError;
          }

          toast({
            title: "Demo Account Created",
            description: "You can now use the demo account to explore the app.",
          });
        } else if (error.message === 'Email logins are disabled') {
          setEmailAuthEnabled(false);
          throw new Error('Email authentication is currently disabled. Please try again later.');
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Demo Login Successful",
          description: "You're now logged in as a demo user.",
        });
      }
    } catch (error: any) {
      console.error('Error in demo login:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to login with demo account",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('🔍 Auth Page - Starting session check...');

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session check error:', sessionError);
          throw sessionError;
        }
        
        if (session?.user && mounted) {
          console.log('✅ Active session found, redirecting to home');
          navigate('/');
        } else {
          console.log('ℹ️ No active session found');
          if (mounted) {
            setIsLoading(false);
            setSessionChecked(true);
          }
        }
      } catch (err: any) {
        console.error('❌ Error checking session:', err);
        if (mounted) {
          setIsLoading(false);
          setSessionChecked(true);
          setAuthError(err.message);
          toast({
            title: "Error",
            description: "Failed to check authentication status",
            variant: "destructive",
          });
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setIsLoading(false);
        setSessionChecked(true);
      }
    });

    checkSession();

    return () => {
      console.log('🧹 Auth Page - Cleaning up...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading && !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-500">Checking authentication status...</p>
        </div>
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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {emailAuthEnabled ? 'Or try the demo' : 'Use demo account'}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDemoLogin}
          >
            Try Demo Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;