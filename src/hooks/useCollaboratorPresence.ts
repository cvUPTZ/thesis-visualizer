import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Collaborator {
  email: string;
  online_at: string;
  presence_ref: string;
}

export const useCollaboratorPresence = (thesisId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`thesis:${thesisId}`);

    const handlePresenceSync = () => {
      const state = channel.presenceState();
      const activeCollaborators = Object.values(state).flat().map((presence: any) => ({
        email: presence.email,
        online_at: presence.online_at,
        presence_ref: presence.presence_ref
      }));
      setCollaborators(activeCollaborators);
    };

    channel
      .on('presence', { event: 'sync' }, handlePresenceSync)
      .on('presence', { event: 'join' }, handlePresenceSync)
      .on('presence', { event: 'leave' }, handlePresenceSync)
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const presenceData = {
          email: user.email,
          online_at: new Date().toISOString(),
          presence_ref: `${user.id}-${Date.now()}`
        };

        await channel.track(presenceData);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thesisId]);

  return { collaborators };
};