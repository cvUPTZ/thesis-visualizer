import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';

export interface CollaboratorPresenceProps {
  thesisId: string;
}

interface Collaborator {
  id: string;
  email: string;
  role: string;
}

export const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({ thesisId }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const { userId } = useAuth();
  
  console.log('🤝 Rendering CollaboratorPresence for thesis:', thesisId);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        console.log('📥 Fetching collaborators for thesis:', thesisId);
        const { data, error } = await supabase
          .from('thesis_collaborators')
          .select(`
            user_id,
            role,
            profiles (
              email
            )
          `)
          .eq('thesis_id', thesisId);

        if (error) {
          console.error('❌ Error fetching collaborators:', error);
          return;
        }

        if (data) {
          console.log('✅ Collaborators fetched:', data);
          const formattedCollaborators = data.map(collab => ({
            id: collab.user_id,
            email: collab.profiles?.email || 'Unknown',
            role: collab.role
          }));
          setCollaborators(formattedCollaborators);
        }
      } catch (error) {
        console.error('❌ Error in fetchCollaborators:', error);
      }
    };

    fetchCollaborators();
  }, [thesisId]);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg border shadow-lg">
      <h3 className="text-sm font-medium mb-2">Active Collaborators</h3>
      <div className="flex flex-col gap-2">
        {collaborators.map((collaborator) => (
          <div 
            key={collaborator.id}
            className="flex items-center gap-2"
          >
            <Avatar className="h-8 w-8">
              <span className="text-xs">
                {collaborator.email[0].toUpperCase()}
              </span>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {collaborator.email}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {collaborator.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};