import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DemoLogin } from "@/components/auth/DemoLogin";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthLoader } from "@/components/auth/AuthLoader";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AuthAlternate = () => {
  const { isLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('AuthAlternate component mount - Auth state:', { isAuthenticated, userRole, isLoading });
    
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-black/20">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-300" />
          <span className="text-white font-semibold">Thesis Visualizer</span>
        </div>
      </div>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Welcome Text */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">
              Welcome to Your Academic Journey
            </h1>
            <p className="text-purple-200">
              Sign in to start visualizing your thesis
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Auth
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'rgb(147, 51, 234)',
                        brandAccent: 'rgb(126, 34, 206)',
                        brandButtonText: 'white',
                        defaultButtonBackground: 'rgba(0,0,0,0.4)',
                        defaultButtonBackgroundHover: 'rgba(0,0,0,0.5)',
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
                    label: 'text-purple-100',
                    button: 'hover:opacity-90 transition-opacity',
                    input: 'bg-white/20 border-purple-400/30 text-white placeholder-purple-200',
                  },
                }}
                providers={[]}
                redirectTo={`${window.location.origin}/auth/callback`}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email address',
                      password_label: 'Password',
                      button_label: 'Continue with Email',
                      loading_button_label: 'Signing in...',
                      email_input_placeholder: 'your@email.com',
                      password_input_placeholder: 'Your secure password',
                    }
                  }
                }}
              />
              
              <AuthDivider />
              
              <DemoLogin />
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-sm text-purple-200">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-white hover:text-purple-300 underline transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-white hover:text-purple-300 underline transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthAlternate;