import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { User2Icon } from 'lucide-react';

interface CollaboratorPresence {
  user_id: string;
  email: string;
  last_seen: string;
  cursor_position?: { x: number; y: number };
  status?: 'active' | 'idle';
  avatar_url?: string;
}

export const CollaboratorPresence = ({ thesisId }: { thesisId: string }) => {
  const [activeCollaborators, setActiveCollaborators] = useState<CollaboratorPresence[]>([]);

  useEffect(() => {
    console.log('Setting up presence channel for thesis:', thesisId);
    
    const channel = supabase.channel(`thesis:${thesisId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState<CollaboratorPresence>();
        const collaborators = Object.values(newState).flat();
        setActiveCollaborators(collaborators);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Collaborator joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
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
              status: 'active',
              avatar_url: user.user_metadata?.avatar_url
            });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thesisId]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-background/80 backdrop-blur-lg rounded-full p-2 shadow-lg border border-border">
        <div className="flex items-center gap-1">
          <User2Icon className="w-4 h-4 text-muted-foreground mr-2" />
          <AnimatePresence mode="popLayout">
            {activeCollaborators.map((collaborator) => (
              <motion.div
                key={collaborator.user_id}
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <Avatar className="h-8 w-8 border-2 border-background transition-all duration-200 hover:scale-110">
                          {collaborator.avatar_url ? (
                            <AvatarImage src={collaborator.avatar_url} alt={collaborator.email} />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                              {collaborator.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${
                          collaborator.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="flex flex-col items-center gap-1">
                      <p className="font-medium">{collaborator.email}</p>
                      <Badge variant="secondary" className="text-xs">
                        {collaborator.status === 'active' ? 'Active now' : 'Idle'}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Last seen: {new Date(collaborator.last_seen).toLocaleTimeString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};