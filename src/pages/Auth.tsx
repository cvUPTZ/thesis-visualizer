import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inviteThesisId = searchParams.get('thesisId');
  const inviteRole = searchParams.get('role');

  useEffect(() => {
    console.log('Auth component mounted');
    console.log('Invite params:', { inviteThesisId, inviteRole });

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      if (session) {
        // If there's an invite, handle it
        if (inviteThesisId && inviteRole) {
          await handleInviteAcceptance(session.user.id, inviteThesisId, inviteRole);
        }
        navigate("/");
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_IN" && session) {
          // If there's an invite, handle it
          if (inviteThesisId && inviteRole) {
            await handleInviteAcceptance(session.user.id, inviteThesisId, inviteRole);
          }
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, inviteThesisId, inviteRole]);

  const handleInviteAcceptance = async (userId: string, thesisId: string, role: string) => {
    try {
      console.log('Handling invite acceptance:', { userId, thesisId, role });
      
      // Check if already a collaborator
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

      // Add as collaborator
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