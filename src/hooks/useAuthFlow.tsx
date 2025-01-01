import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNotification } from "@/contexts/NotificationContext";

interface UseAuthFlowProps {
  inviteThesisId: string | null;
  inviteRole: string | null;
}

export const useAuthFlow = ({ inviteThesisId, inviteRole }: UseAuthFlowProps) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
    const { pathname } = useLocation();
  const { toast } = useNotification();

  const handleInviteAcceptance = async (userId: string, thesisId: string, role: string) => {
    try {
        console.log('Handling invite acceptance:', { userId, thesisId, role });

        const { data: existingCollaborator, error: checkError } = await supabase
            .from('thesis_collaborators')
            .select('*')
            .eq('thesis_id', thesisId)
            .eq('user_id', userId)
           .maybeSingle();


      if (checkError) {
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

 useEffect(() => {
       console.log('Auth flow initialized');
        console.log('Invite params:', { inviteThesisId, inviteRole });


        const checkUser = async () => {
            try {
               console.log('Checking user session...');
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setError(sessionError.message);
                    return;
                }

               if (!session) {
                    console.log('No active session found');
                    return;
                }

               const user = session.user;
                console.log('User found in session:', user.email);

              if (!user) {
                    console.error('No user found in session');
                   setError("Unable to verify user. Please sign in again.");
                   return;
              }
              console.log('User verified successfully:', user.email);
                if (inviteThesisId && inviteRole) {
                    await handleInviteAcceptance(user.id, inviteThesisId, inviteRole);
                }
                 navigate("/dashboard");

            } catch (error) {
                console.error('Error in checkUser:', error);
                setError("An unexpected error occurred. Please try again.");
            }
        };

    checkUser();

 }, [navigate, toast, inviteThesisId, inviteRole, pathname]);

    return { error };
};