import React from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DemoLogin } from './DemoLogin';
import { AuthDivider } from './AuthDivider';
import { useSearchParams } from 'react-router-dom';

export const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const redirectTo = `${window.location.origin}/auth/callback`;

  return (
    <>
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
        providers={["google"]}
        redirectTo={redirectTo}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email address',
              password_label: 'Password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in...',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              social_provider_text: "Continue with {{provider}}",
            },
            sign_up: {
              email_label: 'Email address',
              password_label: 'Create a Password',
              button_label: 'Sign up',
              loading_button_label: 'Signing up...',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Create a password',
              social_provider_text: "Sign up with {{provider}}",
            }
          }
        }}
      />
      
      <AuthDivider />
      <div className="space-y-3">
        <DemoLogin />
      </div>
    </>
  );
};