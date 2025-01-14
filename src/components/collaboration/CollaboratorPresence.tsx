import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

interface ActiveCollaborator {
  id: string;
  user_id: string;
  email?: string;
  last_seen: string;
}

interface CollaboratorPresenceProps {
  thesisId: string;
}

export const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({ thesisId }) => {
  const [activeCollaborators, setActiveCollaborators] = useState<ActiveCollaborator[]>([]);
  const { toast } = useToast();
  const presenceChannel = React.useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const setupPresence = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get initial collaborators
        const { data: collaborators, error } = await supabase
          .from('thesis_collaborators')
          .select(`
            id,
            user_id,
            profiles!inner (
              email
            )
          `)
          .eq('thesis_id', thesisId);

        if (error) throw error;

        // Set up presence channel
        presenceChannel.current = supabase.channel(`presence:${thesisId}`);
        
        presenceChannel.current
          .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.current?.presenceState() || {};
            console.log('Presence state:', state);
            
            // Create a Set to track unique user_ids
            const uniqueCollaborators = new Map<string, ActiveCollaborator>();
            
            // Process presence state
            Object.values(state).flat().forEach((presence: any) => {
              if (!uniqueCollaborators.has(presence.user_id)) {
                uniqueCollaborators.set(presence.user_id, {
                  id: presence.user_id,
                  user_id: presence.user_id,
                  email: presence.email,
                  last_seen: presence.online_at
                });
              }
            });

            setActiveCollaborators(Array.from(uniqueCollaborators.values()));
          })
          .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            console.log('User joined:', key, newPresences);
          })
          .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            console.log('User left:', key, leftPresences);
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await presenceChannel.current?.track({
                user_id: user.id,
                email: user.email,
                online_at: new Date().toISOString()
              });
            }
          });

        // Initialize with unique collaborators from database
        const uniqueInitialCollaborators = new Map<string, ActiveCollaborator>();
        collaborators?.forEach(collab => {
          if (!uniqueInitialCollaborators.has(collab.user_id)) {
            uniqueInitialCollaborators.set(collab.user_id, {
              id: collab.user_id,
              user_id: collab.user_id,
              email: collab.profiles?.email,
              last_seen: new Date().toISOString()
            });
          }
        });

        setActiveCollaborators(Array.from(uniqueInitialCollaborators.values()));

      } catch (error) {
        console.error('Error setting up presence:', error);
        toast({
          title: "Error",
          description: "Failed to load collaborators",
          variant: "destructive",
        });
      }
    };

    setupPresence();

    return () => {
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current);
      }
    };
  }, [thesisId, toast]);

  return (
    <div className="flex -space-x-2 overflow-hidden p-2">
      <AnimatePresence>
        {activeCollaborators.map((collaborator) => (
          <motion.div
            key={collaborator.user_id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="relative inline-block"
          >
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${collaborator.email}`} 
                alt={collaborator.email} 
              />
              <AvatarFallback>
                {collaborator.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-background" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};