import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useSessionManager = (handleLogout: () => Promise<void>) => {
  const { toast } = useToast();

  const handleSessionConflict = async () => {
    console.log('🔄 Session conflict detected, logging out...');
    await handleLogout();
    toast({
      title: "Session Conflict",
      description: "Your account is already active in another browser. You've been logged out.",
      variant: "destructive",
    });
  };

  const manageActiveSession = async (session: Session | null) => {
    try {
      console.log('🔄 Managing active session...');
      
      if (!session?.access_token || !session?.user?.id) {
        console.error('❌ Invalid session data');
        return false;
      }

      // Check for existing sessions
      const { data: existingSessions, error: checkError } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', session.user.id);

      if (checkError) throw checkError;

      if (existingSessions && existingSessions.length > 0) {
        const existingSession = existingSessions[0];
        
        // If different session exists, handle conflict
        if (existingSession.session_id !== session.access_token) {
          console.log('❌ Session conflict detected');
          await handleSessionConflict();
          return false;
        }

        // Update last_seen for existing session
        const { error: updateError } = await supabase
          .from('active_sessions')
          .update({ last_seen: new Date().toISOString() })
          .eq('session_id', session.access_token);

        if (updateError) throw updateError;
      } else {
        // Create new session record
        const { error: insertError } = await supabase
          .from('active_sessions')
          .insert([
            { 
              user_id: session.user.id, 
              session_id: session.access_token 
            }
          ]);

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('❌ Error managing active session:', error);
      return false;
    }
  };

  const cleanupSession = async (userId: string | null) => {
    if (userId) {
      await supabase
        .from('active_sessions')
        .delete()
        .eq('user_id', userId);
    }
  };

  return {
    manageActiveSession,
    cleanupSession
  };
};