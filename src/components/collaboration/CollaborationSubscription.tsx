import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CollaborationSubscriptionProps {
  thesisId: string;
  onCollaboratorJoined: (email: string, role: string) => void;
  onError: (error: Error) => void;
}

export const useCollaborationSubscription = ({
  thesisId,
  onCollaboratorJoined,
  onError,
}: CollaborationSubscriptionProps) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 Setting up collaboration subscription for thesis:', thesisId);
    
    const channelName = `thesis_collaborators_${thesisId}`;
    console.log('📡 Creating channel:', channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'thesis_collaborators',
          filter: `thesis_id=eq.${thesisId}`,
        },
        async (payload) => {
          console.log('📥 Collaboration event received:', payload);
          
          try {
            if (payload.eventType === 'INSERT') {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('id', payload.new.user_id)
                .single();

              if (profileError) {
                console.error('❌ Error fetching profile:', profileError);
                throw profileError;
              }

              const collaboratorEmail = profileData?.email || 'A new collaborator';
              console.log('✉️ New collaborator joined:', collaboratorEmail);
              
              onCollaboratorJoined(collaboratorEmail, payload.new.role);
            }
          } catch (error: any) {
            console.error('❌ Error handling collaboration event:', error);
            onError(error);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to collaboration changes');
          toast({
            title: "Connected",
            description: "Listening for collaboration updates",
          });
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Failed to subscribe to collaboration changes');
          onError(new Error('Failed to connect to real-time updates'));
        }
      });

    return () => {
      console.log('🧹 Cleaning up subscription for channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, [thesisId, onCollaboratorJoined, onError, toast]);
};