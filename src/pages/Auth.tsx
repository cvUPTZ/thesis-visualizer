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

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log('🔍 Auth Page - Checking current session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Auth Page - Session error:', sessionError);
          throw sessionError;
        }
        
        if (session?.user && mounted) {
          console.log('✅ Auth Page - User already authenticated:', session.user.email);
          
          // Wait for role to be loaded
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();

          console.log('👤 Auth Page - User role loaded:', profile?.roles?.name);
          
          if (mounted) {
            navigate('/');
          }
        } else {
          console.log('ℹ️ Auth Page - No active session found');
          if (mounted) {
            navigate('/welcome');
          }
        }
      } catch (err) {
        console.error('❌ Auth Page - Error checking session:', err);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
        if (mounted) {
          navigate('/welcome');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, skipping state update');
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        setIsLoading(true);
        
        try {
          // Wait for role to be loaded
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          console.log('👤 User role loaded:', profile?.roles?.name);
          
          if (mounted) {
            toast({
              title: "Welcome!",
              description: "You have successfully signed in.",
            });
            navigate('/');
          }
        } catch (error) {
          console.error('❌ Error loading user profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    });

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