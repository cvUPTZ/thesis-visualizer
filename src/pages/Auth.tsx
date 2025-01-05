import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DemoLogin } from "@/components/auth/DemoLogin";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoader } from "@/components/auth/AuthLoader";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const { isLoading } = useAuth();
  
  if (isLoading) {
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
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            redirectTo={`${window.location.origin}/auth/callback`}
          />
          <AuthDivider />
          <DemoLogin />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;