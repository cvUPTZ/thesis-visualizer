import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');

  useEffect(() => {
    console.log('Auth component mounted');
    console.log('Invite params:', { inviteThesisId, inviteRole });

    let mounted = true;

    const checkUser = async () => {
      try {
        console.log('Checking user session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setError(sessionError.message);
          }
          return;
        }

        if (!session) {
          console.log('No active session found');
          return;
        }

        console.log('Verifying user session:', session.user.email);
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('User verification failed:', userError);
          if (mounted) {
            setError("Session verification failed. Please sign in again.");
          }
          return;
        }

        if (!user) {
          console.error('No user found after verification');
          if (mounted) {
            setError("Unable to verify user. Please sign in again.");
          }
          return;
        }

        console.log('User verified successfully:', user.email);
        if (mounted) {
          if (inviteThesisId && inviteRole) {
            await handleInviteAcceptance(user.id, inviteThesisId, inviteRole);
          }
          navigate("/");
        }
      } catch (error) {
        console.error('Error in checkUser:', error);
        if (mounted) {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (!mounted) return;

        if (event === "SIGNED_IN" && session) {
          console.log('User signed in:', session.user.email);
          try {
            if (inviteThesisId && inviteRole) {
              await handleInviteAcceptance(session.user.id, inviteThesisId, inviteRole);
            }
            toast({
              title: "Welcome!",
              description: "You have successfully signed in.",
            });
            navigate("/");
          } catch (error) {
            console.error('Error handling sign in:', error);
            setError("Error processing sign in. Please try again.");
          }
        } else if (event === "SIGNED_OUT") {
          console.log('User signed out');
          setError(null);
        }
      }
    );

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate, toast, inviteThesisId, inviteRole]);

  const handleInviteAcceptance = async (userId: string, thesisId: string, role: string) => {
    try {
      console.log('Handling invite acceptance:', { userId, thesisId, role });
      
      const { data: existingCollaborator, error: checkError } = await supabase
        .from('thesis_collaborators')
        .select('*')
        .eq('thesis_id', thesisId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing collaborator:', checkError);
        throw checkError;
      }

      if (existingCollaborator) {
        console.log('Already a collaborator:', existingCollaborator);
        toast({
          title: "Already a collaborator",
          description: "You are already a collaborator on this thesis.",
        });
        return;
      }

      const { error: insertError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: userId,
          role: role
        });

      if (insertError) {
        console.error('Error accepting invitation:', insertError);
        toast({
          title: "Error",
          description: "Could not accept the invitation. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully added as collaborator');
      toast({
        title: "Success",
        description: "You have been added as a collaborator.",
      });
    } catch (error) {
      console.error('Error handling invitation:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your invitation.",
        variant: "destructive",
      });
    }
  };

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
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;