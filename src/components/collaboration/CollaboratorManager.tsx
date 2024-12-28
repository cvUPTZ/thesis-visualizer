import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';

interface Collaborator {
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
}

interface CollaboratorManagerProps {
  thesisId: string;
  isOwner: boolean;
}

export const CollaboratorManager = ({ thesisId, isOwner }: CollaboratorManagerProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const fetchCollaborators = async () => {
    console.log('Fetching collaborators for thesis:', thesisId);
    
    const { data, error } = await supabase
      .from('thesis_collaborators')
      .select(`
        user_id,
        role,
        created_at,
        profiles:user_id (
          email
        )
      `)
      .eq('thesis_id', thesisId);

    if (error) {
      console.error('Error fetching collaborators:', error);
      return;
    }

    console.log('Fetched collaborators:', data);

    const formattedCollaborators = data.map(collab => ({
      ...collab,
      email: collab.profiles?.email
    }));

    setCollaborators(formattedCollaborators);
  };

  useEffect(() => {
    fetchCollaborators();
  }, [thesisId]);

  return (
    <Card className="border-2 border-editor-border">
      <CardHeader>
        <CardTitle className="text-lg font-serif">Collaborators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOwner && (
          <CollaboratorInviteForm
            thesisId={thesisId}
            onInviteSuccess={fetchCollaborators}
          />
        )}
        <CollaboratorList
          collaborators={collaborators}
          thesisId={thesisId}
          isOwner={isOwner}
          onCollaboratorRemoved={fetchCollaborators}
        />
      </CardContent>
    </Card>
  );
};