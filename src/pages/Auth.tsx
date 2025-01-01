import { useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      console.log('Checking user session in Auth page');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            toast({
              title: "Authentication Error",
              description: "There was an error checking your session.",
              variant: "destructive",
            });
          }
          return;
        }

        if (session && location.pathname === '/auth' && mounted) {
          console.log('User is already authenticated, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error in checkUser:', error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in Auth page:', event);
      
      if (event === 'SIGNED_IN' && session && location.pathname === '/auth' && mounted) {
        console.log('Session detected, redirecting to dashboard');
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT' && mounted) {
        console.log('User signed out');
        if (location.pathname !== '/auth') {
          navigate('/auth', { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  // Get the current origin without any trailing slash
  const siteUrl = window.location.origin.replace(/\/$/, '');
  console.log('Current site URL:', siteUrl);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your thesis workspace
          </p>
        </div>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </div>
    </div>
  );
};

export default Auth;