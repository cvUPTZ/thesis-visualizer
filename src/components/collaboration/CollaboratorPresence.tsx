import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface Presence {
  user: {
    id: string;
    email: string;
    lastActive: string;
  };
}

interface CollaboratorPresenceProps {
  thesisId: string;
}

export const CollaboratorPresence = ({ thesisId }: CollaboratorPresenceProps) => {
  const [presences, setPresences] = useState<Record<string, Presence[]>>({});
  const { userId, userEmail } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId || !thesisId) {
      console.log('⚠️ Missing userId or thesisId for presence tracking');
      return;
    }

    console.log('🔄 Initializing real-time presence for thesis:', thesisId);

    const channel = supabase.channel(`thesis:${thesisId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    const presence = {
      user: {
        id: userId,
        email: userEmail || 'Anonymous',
        lastActive: new Date().toISOString(),
      },
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('👥 Presence sync:', channel.presenceState());
        setPresences(channel.presenceState());
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('🟢 User joined:', key, newPresences);
        toast({
          title: "Collaborator joined",
          description: `${newPresences[0].user.email} is now online`,
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('🔴 User left:', key, leftPresences);
        toast({
          title: "Collaborator left",
          description: `${leftPresences[0].user.email} went offline`,
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(presence);
        }
      });

    return () => {
      console.log('🧹 Cleaning up presence channel');
      channel.unsubscribe();
    };
  }, [thesisId, userId, userEmail, toast]);

  if (!userId) return null;

  return (
    <div className="fixed bottom-4 right-4 flex -space-x-2">
      <TooltipProvider>
        {Object.values(presences).flat().map((presence: Presence) => (
          <Tooltip key={presence.user.id}>
            <TooltipTrigger>
              <Avatar className="border-2 border-white">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${presence.user.email}`} 
                  alt={presence.user.email} 
                />
                <AvatarFallback>
                  {presence.user.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{presence.user.email}</p>
              <p className="text-xs text-muted-foreground">
                Active {new Date(presence.user.lastActive).toLocaleTimeString()}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};