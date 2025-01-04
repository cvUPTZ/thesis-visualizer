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
    const fetchData = async () => {
      if (!userId) {
        setIsLoading(false);
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
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Failed to load user profile");
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched profile:", profile);
        setUserProfile(profile);

        console.log("Fetching theses stats for:", userId);
        const { data: theses, error: thesesError } = await supabase
          .from("thesis_collaborators")
          .select("thesis_id")
          .eq("user_id", userId);

        if (thesesError) {
          console.error("Error fetching theses:", thesesError);
          setError("Failed to load theses statistics");
          toast({
            title: "Error",
            description: "Failed to load theses statistics",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched theses:", theses);
        setThesesStats({
          total: theses?.length || 0,
          inProgress: theses?.length || 0,
          completed: 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An unexpected error occurred");
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, toast]);

  return { userProfile, thesesStats, isLoading, error };
};