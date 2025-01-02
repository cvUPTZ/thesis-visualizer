// src/hooks/useAuthFlow.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

interface UseAuthFlowProps {
  inviteThesisId: string | null;
  inviteRole: string | null;
}

interface AuthError extends Error {
  code?: string;
  status?: number;
}

export const useAuthFlow = ({ inviteThesisId, inviteRole }: UseAuthFlowProps) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useNotification();
  const { isAuthenticated, user } = useAuth();

  const handleInviteAcceptance = useCallback(
    async (userId: string, thesisId: string, role: string) => {
      try {
        const { data: existingCollaborator, error: checkError } = await supabase
          .from("thesis_collaborators")
          .select("*")
          .eq("thesis_id", thesisId)
          .eq("user_id", userId)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingCollaborator) {
          toast({
            title: "Already a collaborator",
            description: "You are already a collaborator on this thesis.",
          });
          return;
        }

        const { error: insertError } = await supabase
          .from("thesis_collaborators")
          .insert({
            thesis_id: thesisId,
            user_id: userId,
            role: role,
          });

        if (insertError) throw insertError;

        toast({
          title: "Success",
          description: "You have been added as a collaborator.",
        });
      } catch (error) {
        const authError = error as AuthError;
        toast({
          title: "Error",
          description: authError.message || "An error occurred while processing your invitation.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const checkUser = async () => {
      if (!mounted) return;

      try {
        if (!isAuthenticated) {
          if (location.pathname !== "/auth") {
            navigate("/auth", { replace: true });
          }
          return;
        }

        if (!user) {
          setError("Unable to verify user. Please sign in again.");
          navigate("/auth", { replace: true });
          return;
        }

        if (inviteThesisId && inviteRole) {
          await handleInviteAcceptance(user.id, inviteThesisId, inviteRole);
        }

        if (location.pathname !== "/dashboard") {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        const authError = error as AuthError;
        setError(authError.message || "An unexpected error occurred. Please try again.");
      }
    };

    const authChangeHandler = async (event: string) => {
      if (!mounted) return;

      try {
        if (event === "SIGNED_IN" && user) {
          if (inviteThesisId && inviteRole) {
            await handleInviteAcceptance(user.id, inviteThesisId, inviteRole);
          }

          if (location.pathname !== "/dashboard") {
            toast({
              title: "Welcome!",
              description: "You have successfully signed in.",
            });
            navigate("/dashboard", { replace: true });
          }
        } else if (event === "SIGNED_OUT") {
          if (location.pathname !== "/auth") {
            navigate("/auth", { replace: true });
          }
        }
      } catch (error) {
        const authError = error as AuthError;
        setError(authError.message || "Error processing sign in. Please try again.");
      }
    };

    checkUser();

    const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (mounted) {
          await authChangeHandler(event);
        }
      }
    );

    subscription = sub;

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [
    navigate,
    toast,
    inviteThesisId,
    inviteRole,
    location.pathname,
    isAuthenticated,
    user,
    handleInviteAcceptance,
  ]);

  return { error };
};