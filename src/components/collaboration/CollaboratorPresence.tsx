import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

interface CollaboratorPresence {
  id: string;
  user_id: string;
  thesis_id: string;
  last_seen: string;
  email?: string;
}

interface CollaboratorPresenceProps {
  thesisId: string;
}

export const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({ thesisId }) => {
  const [activeCollaborators, setActiveCollaborators] = useState<CollaboratorPresence[]>([]);
  const { toast } = useToast();
  
  const fetchCollaborators = async () => {
    try {
      console.log('Fetching collaborators for thesis:', thesisId);
      
      const { data: collaborators, error } = await supabase
        .from('thesis_collaborators')
        .select(`
          id,
          user_id,
          thesis_id,
          profiles (
            email
          )
        `)
        .eq('thesis_id', thesisId);

      if (error) {
        console.error('Error fetching collaborators:', error);
        throw error;
      }

      // Transform the data to include email from profiles
      const transformedCollaborators = collaborators.map(collab => ({
        id: collab.id,
        user_id: collab.user_id,
        thesis_id: thesisId,
        last_seen: new Date().toISOString(),
        email: collab.profiles?.email
      }));

      console.log('Active collaborators:', transformedCollaborators);
      setActiveCollaborators(transformedCollaborators);
    } catch (error: any) {
      console.error('Error in CollaboratorPresence:', error);
      toast({
        title: "Error",
        description: "Failed to load collaborators",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCollaborators();
    
    // Set up presence channel
    const channel = supabase.channel(`presence:${thesisId}`);
    let userId = '';

    // Get user ID first
    const setupPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to presence channel');
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });
    };

    setupPresence();

    // Subscribe to presence changes and thesis_collaborators changes
    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync event received');
        const state = channel.presenceState();
        console.log('Current presence state:', state);
        fetchCollaborators(); // Refresh collaborators list
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        fetchCollaborators();
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        fetchCollaborators();
      });

    // Subscribe to thesis_collaborators changes
    const collaboratorsChannel = supabase
      .channel('thesis_collaborators_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'thesis_collaborators',
          filter: `thesis_id=eq.${thesisId}`
        },
        (payload) => {
          console.log('Thesis collaborators changed:', payload);
          fetchCollaborators();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      console.log('Cleaning up presence subscription');
      channel.unsubscribe();
      collaboratorsChannel.unsubscribe();
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