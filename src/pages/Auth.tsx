import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DemoLogin } from "@/components/auth/DemoLogin";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthLoader } from "@/components/auth/AuthLoader";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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

  const handleTestRedirect = () => {
    console.log('🔄 Test redirect to dashboard');
    navigate('/dashboard');
  };

  if (isLoading) {
    console.log('⌛ Loading auth component...');
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] flex flex-col">
      {/* Navbar placeholder to maintain consistency */}
      <div className="h-16 bg-[#1A1F2C] border-b border-gray-800"></div>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-[#9b87f5] mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400">
              Sign in to continue your academic journey
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-lg">
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
                        brand: '#9b87f5',
                        brandAccent: '#7E69AB',
                        brandButtonText: 'white',
                        defaultButtonBackground: '#1A1F2C',
                        defaultButtonBackgroundHover: '#2C3E50',
                      },
                      radii: {
                        borderRadiusButton: '0.5rem',
                        buttonBorderRadius: '0.5rem',
                        inputBorderRadius: '0.5rem',
                      },
                    },
                  },
                  className: {
                    container: 'text-white',
                    label: 'text-gray-300',
                    button: 'hover:opacity-90 transition-opacity',
                    input: 'bg-white/10 border-gray-700 text-white placeholder-gray-400',
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
              <div className="space-y-3">
                <DemoLogin />
                <Button
                  variant="outline"
                  className="w-full bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20 text-[#9b87f5]"
                  onClick={handleTestRedirect}
                >
                  Test Dashboard Access
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-400">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-[#9b87f5] hover:text-[#D6BCFA] transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#9b87f5] hover:text-[#D6BCFA] transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;