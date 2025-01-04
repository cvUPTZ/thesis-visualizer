import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { CollaboratorWithProfile } from '@/types/collaborator';

export const useCollaboratorPermissions = (thesisId: string) => {
  const [collaborators, setCollaborators] = useState<CollaboratorWithProfile[]>([]);
  const [canManageCollaborators, setCanManageCollaborators] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkPermissions = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          roles (
            name
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setError(profileError);
        return;
      }

      if (profileData) {
        setUserProfile(profileData);
        console.log('User profile:', profileData);
      }

      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('thesis_id', thesisId)
        .eq('user_id', session.user.id)
        .single();

      if (collaboratorError && collaboratorError.code !== 'PGRST116') {
        console.error('Error checking permissions:', collaboratorError);
        setError(collaboratorError);
        return;
      }

      const role = collaboratorData?.role;
      setCurrentUserRole(role);
      setCanManageCollaborators(
        role === 'owner' ||
        role === 'admin' ||
        profileData?.roles?.name === 'admin'
      );
    } catch (error: any) {
      console.error('Error checking permissions:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('thesis_collaborators')
        .select(`
          user_id,
          role,
          created_at,
          profiles (
            email,
            role_id
          )
        `)
        .eq('thesis_id', thesisId);

      if (error) {
        console.error('Error fetching collaborators:', error);
        setError(error);
        return;
      }

      if (data) {
        setCollaborators(data as CollaboratorWithProfile[]);
      }
    } catch (error: any) {
      console.error('Error fetching collaborators:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (thesisId) {
      checkPermissions();
      fetchCollaborators();
    }
  }, [thesisId]);

  return {
    collaborators,
    canManageCollaborators,
    currentUserRole,
    userProfile,
    loading,
    error,
    fetchCollaborators
  };
};
