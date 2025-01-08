import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

interface CollaboratorPresence {
  id: string;
  user_id: string;
  thesis_id: string;
  email?: string;
  last_seen?: string;
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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Query all collaborators for this thesis
      const { data: collaborators, error } = await supabase
        .from('thesis_collaborators')
        .select(`
          id,
          user_id,
          thesis_id,
          profiles!inner (
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
        email: collab.profiles?.email,
        last_seen: new Date().toISOString()
      }));

      console.log('Active collaborators:', transformedCollaborators);
      setActiveCollaborators(transformedCollaborators);

      // Track presence for current user
      const presenceChannel = supabase.channel(`presence:${thesisId}`);
      await presenceChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            email: user.email,
            online_at: new Date().toISOString()
          });
        }
      });
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
    
    // Subscribe to presence changes and thesis_collaborators changes
    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync event received');
        const state = channel.presenceState();
        console.log('Current presence state:', state);
        
        // Update active collaborators based on presence state
        const presentUsers = Object.values(state).flat().map((presence: any) => ({
          user_id: presence.user_id,
          email: presence.email,
          thesis_id: thesisId,
          last_seen: presence.online_at
        }));
        
        setActiveCollaborators(prev => {
          const newCollaborators = [...prev];
          presentUsers.forEach(user => {
            const index = newCollaborators.findIndex(c => c.user_id === user.user_id);
            if (index >= 0) {
              newCollaborators[index] = { ...newCollaborators[index], ...user };
            }
          });
          return newCollaborators;
        });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        fetchCollaborators();
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        fetchCollaborators();
      })
      .subscribe();

    // Subscribe to thesis_collaborators changes
    const collaboratorsChannel = supabase
      .channel('thesis_collaborators_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
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