import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DemoLogin } from "@/components/auth/DemoLogin";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoader } from "@/components/auth/AuthLoader";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const { isLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('Auth component mount - Auth state:', { isAuthenticated, userRole, isLoading });
    
    if (isAuthenticated && !isLoading) {
      console.log('✅ User is authenticated, redirecting based on role:', userRole);
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, userRole, isLoading, navigate]);

  if (isLoading) {
    console.log('⌛ Loading auth component...');
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
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
            redirectTo={`${window.location.origin}/auth/callback`}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                }
              }
            }}
          />
          <AuthDivider />
          <DemoLogin />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;