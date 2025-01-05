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

  console.log('🔄 Rendering AuthForm with redirectTo:', redirectTo);

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
                inputBackground: 'rgba(255, 255, 255, 0.05)',
                inputBorder: 'rgba(255, 255, 255, 0.1)',
                inputBorderHover: 'rgba(255, 255, 255, 0.2)',
                inputBorderFocus: '#9b87f5',
              },
              radii: {
                borderRadiusButton: '0.5rem',
                buttonBorderRadius: '0.5rem',
                inputBorderRadius: '0.5rem',
              },
              fonts: {
                bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
                buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
                inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
              },
            },
          },
          className: {
            container: 'text-white font-sans',
            label: 'text-gray-300 font-sans',
            button: 'hover:opacity-90 transition-opacity font-sans',
            input: 'bg-white/10 border-gray-700 text-white placeholder-gray-400 font-sans',
            loader: 'border-t-[#9b87f5]',
          },
        }}
        providers={["google"]}
        redirectTo={redirectTo}
        onlyThirdPartyProviders={false}
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