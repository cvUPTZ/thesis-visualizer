import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';
import { Profile } from '@/types/profile';

interface CollaboratorManagerProps {
  thesisId: string;
  thesisTitle: string;
}

export const CollaboratorManager = ({ thesisId, thesisTitle }: CollaboratorManagerProps) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [canManageCollaborators, setCanManageCollaborators] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const checkPermissions = async () => {
    try {
      console.log('Checking permissions for thesis:', thesisId);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found');
        return;
      }

      // Get user profile to check admin status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      if (profileData) {
        setUserProfile(profileData);
        console.log('User profile:', profileData);
      }

      // Check thesis-specific role
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('thesis_id', thesisId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (collaboratorError) {
        console.error('Error checking permissions:', collaboratorError);
        return;
      }

      const role = collaboratorData?.role;
      setCurrentUserRole(role);
      setCanManageCollaborators(
        role === 'owner' || 
        role === 'admin' || 
        profileData?.role === 'admin'
      );
      console.log('Current user role:', role);
    } catch (error) {
      console.error('Error checking permissions:', error);
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
            email,
            role
          )
        `)
        .eq('thesis_id', thesisId);

      if (error) {
        console.error('Error fetching collaborators:', error);
        return;
      }

      console.log('Fetched collaborators:', data);
      setCollaborators(data || []);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  useEffect(() => {
    if (thesisId) {
      checkPermissions();
      fetchCollaborators();
    }
  }, [thesisId]);

  return (
    <Card className="border-2 border-editor-border">
      <CardHeader>
        <CardTitle className="text-lg font-serif">Collaborators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canManageCollaborators && (
          <CollaboratorInviteForm
            thesisId={thesisId}
            thesisTitle={thesisTitle}
            onInviteSuccess={fetchCollaborators}
            isAdmin={userProfile?.role === 'admin'}
          />
        )}
        <CollaboratorList
          collaborators={collaborators}
          thesisId={thesisId}
          canManageCollaborators={canManageCollaborators}
          currentUserRole={currentUserRole}
          isAdmin={userProfile?.role === 'admin'}
          onCollaboratorRemoved={fetchCollaborators}
        />
      </CardContent>
    </Card>
  );
};