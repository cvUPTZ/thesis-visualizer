import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthStatus = () => {
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Checking authentication status from database...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          console.log('✅ User authenticated:', session.user.email);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('❌ Profile error:', profileError);
            throw profileError;
          }

          if (!profile) {
            console.log('⚠️ No profile found for user');
            throw new Error('No profile found');
          }

          console.log('✅ Profile loaded:', profile);
        } else {
          console.log('ℹ️ No active session');
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        toast({
          title: "Error",
          description: "Failed to verify authentication status",
          variant: "destructive",
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthStatus();
  }, [toast]);

  return { isChecking };
};