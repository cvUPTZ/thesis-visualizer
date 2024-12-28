import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';

interface Collaborator {
  user_id: string;
  role: string;
  created_at: string;
  profiles?: {
    email: string;
  };
}

interface CollaboratorManagerProps {
  thesisId: string;
}

export const CollaboratorManager = ({ thesisId }: CollaboratorManagerProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  const checkOwnership = async () => {
    try {
      console.log('Checking ownership for thesis:', thesisId);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('thesis_id', thesisId)
        .eq('user_id', session.session.user.id)
        .single();

      if (error) {
        console.error('Error checking ownership:', error);
        return;
      }

      setIsOwner(data?.role === 'owner');
      console.log('Is owner:', data?.role === 'owner');
    } catch (error) {
      console.error('Error checking ownership:', error);
    }
  };

  const fetchCollaborators = async () => {
    try {
      console.log('Fetching collaborators for thesis:', thesisId);
      
      const { data, error } = await supabase
        .from('thesis_collaborators')
        .select(`
          user_id,
          role,
          created_at,
          profiles (
            email
          )
        `)
        .eq('thesis_id', thesisId);

      if (error) {
        console.error('Error fetching collaborators:', error);
        return;
      }

      console.log('Fetched collaborators:', data);
      setCollaborators(data);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  useEffect(() => {
    checkOwnership();
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