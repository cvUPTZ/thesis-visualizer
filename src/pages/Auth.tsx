import { useSearchParams, useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const LOADING_TIMEOUT = 10000; // 10 seconds timeout

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');
  const { error } = useAuthFlow({ inviteThesisId, inviteRole });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let mounted = true;
    console.log('🔍 Auth Page - Starting session check...');

    const checkSession = async () => {
      try {
        // Set loading timeout
        timeoutRef.current = setTimeout(() => {
          if (mounted) {
            console.log('⚠️ Auth Page - Loading timeout reached');
            setIsLoading(false);
            setSessionChecked(true);
            toast({
              title: "Loading timeout",
              description: "Session check took too long. Please refresh the page.",
              variant: "destructive",
            });
          }
        }, LOADING_TIMEOUT);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Auth Page - Session error:', sessionError);
          throw sessionError;
        }
        
        if (session?.user && mounted) {
          console.log('✅ Auth Page - User authenticated:', session.user.email);
          
          // Single query for profile and role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`
              email,
              roles (
                name
              )
            `)
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('❌ Auth Page - Error loading profile:', profileError);
            throw profileError;
          }

          console.log('👤 Auth Page - Profile loaded:', profile);
          
          if (mounted) {
            clearTimeout(timeoutRef.current);
            navigate('/');
          }
        } else {
          console.log('ℹ️ Auth Page - No active session');
          if (mounted) {
            clearTimeout(timeoutRef.current);
            setIsLoading(false);
            setSessionChecked(true);
          }
        }
      } catch (err) {
        console.error('❌ Auth Page - Error:', err);
        if (mounted) {
          clearTimeout(timeoutRef.current);
          setIsLoading(false);
          setSessionChecked(true);
          toast({
            title: "Error",
            description: "Failed to check authentication status. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    // Single auth state listener
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
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`
              email,
              roles (
                name
              )
            `)
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;

          console.log('👤 Profile loaded:', profile);
          
          if (mounted) {
            clearTimeout(timeoutRef.current);
            toast({
              title: "Welcome!",
              description: "You have successfully signed in.",
            });
            navigate('/');
          }
        } catch (error: any) {
          console.error('❌ Error loading profile:', error);
          if (mounted) {
            toast({
              title: "Error",
              description: "Failed to load user profile. Please try again.",
              variant: "destructive",
            });
          }
        } finally {
          if (mounted) {
            clearTimeout(timeoutRef.current);
            setIsLoading(false);
          }
        }
      }
    });

    checkSession();

    return () => {
      console.log('🧹 Auth Page - Cleaning up...');
      mounted = false;
      clearTimeout(timeoutRef.current);
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