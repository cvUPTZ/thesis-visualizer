import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';
import { Profile } from '@/types/profile';

interface Collaborator {
  user_id: string;
  role: string;
  created_at: string;
  profiles?: {
    email: string;
    role: string;
  };
}

interface CollaboratorManagerProps {
  thesisId: string;
}

export const CollaboratorManager = ({ thesisId }: CollaboratorManagerProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [canManageCollaborators, setCanManageCollaborators] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const checkPermissions = async () => {
    try {
      console.log('Checking permissions for thesis:', thesisId);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      // Get user profile to check admin status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setUserProfile(profileData);

      const { data, error } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('thesis_id', thesisId)
        .eq('user_id', session.session.user.id)
        .single();

      if (error) {
        console.error('Error checking permissions:', error);
        return;
      }

      const role = data?.role;
      setCurrentUserRole(role);
      setCanManageCollaborators(
        role === 'owner' || 
        role === 'admin' || 
        profileData.role === 'admin'
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
      setCollaborators(data);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  useEffect(() => {
    checkPermissions();
    fetchCollaborators();
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