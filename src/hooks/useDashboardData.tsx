import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDashboardData = (userId: string | null) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [thesesStats, setThesesStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!userId) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        console.log("Fetching user profile for:", userId);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(`
            *,
            roles (
              name
            )
          `)
          .eq("id", userId)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          if (isMounted) {
            setError("Failed to load user profile");
            toast({
              title: "Error",
              description: "Failed to load user profile",
              variant: "destructive",
            });
          }
          return;
        }

        if (!profile && isMounted) {
          setError("User profile not found");
          toast({
            title: "Error",
            description: "User profile not found",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched profile:", profile);
        if (isMounted) {
          setUserProfile(profile);
        }

        console.log("Fetching theses stats for:", userId);
        const { data: theses, error: thesesError } = await supabase
          .from("thesis_collaborators")
          .select("thesis_id, role")
          .eq("user_id", userId);

        if (thesesError) {
          console.error("Error fetching theses:", thesesError);
          if (isMounted) {
            setError("Failed to load theses statistics");
            toast({
              title: "Error",
              description: "Failed to load theses statistics",
              variant: "destructive",
            });
          }
          return;
        }

        console.log("Fetched theses:", theses);
        if (isMounted) {
          setThesesStats({
            total: theses?.length || 0,
            inProgress: theses?.filter(t => t.role === 'editor').length || 0,
            completed: theses?.filter(t => t.role === 'owner').length || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setError("An unexpected error occurred");
          toast({
            title: "Error",
            description: "An unexpected error occurred while loading dashboard data",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId, toast]);

  return { userProfile, thesesStats, isLoading, error };
};