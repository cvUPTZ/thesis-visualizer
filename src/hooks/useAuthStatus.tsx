import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthStatus = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Quick auth check...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('ℹ️ No active session');
          return;
        }

        console.log('✅ Session found:', session.user.email);
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