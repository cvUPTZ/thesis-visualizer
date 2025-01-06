import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CollaboratorPresence {
  user_id: string;
  email: string;
  last_seen: string;
  cursor_position?: { x: number; y: number };
}

export const CollaboratorPresence = ({ thesisId }: { thesisId: string }) => {
  const [activeCollaborators, setActiveCollaborators] = useState<CollaboratorPresence[]>([]);

  useEffect(() => {
    console.log('Setting up presence channel for thesis:', thesisId);
    
    const channel = supabase.channel(`thesis:${thesisId}`)
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync event received');
        const newState = channel.presenceState<CollaboratorPresence>();
        const collaborators = Object.values(newState).flat();
        setActiveCollaborators(collaborators);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Collaborator joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Collaborator left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              user_id: user.id,
              email: user.email,
              last_seen: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      console.log('Cleaning up presence channel');
      supabase.removeChannel(channel);
    };
  }, [thesisId]);

  return (
    <div className="fixed bottom-4 left-4 flex -space-x-2">
      <TooltipProvider>
        {activeCollaborators.map((collaborator) => (
          <Tooltip key={collaborator.user_id}>
            <TooltipTrigger>
              <Avatar className="border-2 border-background w-8 h-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {collaborator.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collaborator.email}</p>
              <Badge variant="secondary" className="mt-1">
                Online
              </Badge>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};