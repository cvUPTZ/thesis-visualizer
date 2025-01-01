import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      console.log('Checking user session in Auth page');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('User is already authenticated, redirecting to dashboard');
        navigate('/dashboard');
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in Auth page:', event);
      if (session) {
        console.log('Session detected, redirecting to dashboard');
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary">Welcome</h1>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                },
              },
            },
            className: {
              container: 'space-y-4',
              button: 'w-full px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded',
              input: 'w-full px-3 py-2 border rounded',
            },
          }}
          providers={['google']}
        />
      </div>
    </div>
  );
};

export default Auth;