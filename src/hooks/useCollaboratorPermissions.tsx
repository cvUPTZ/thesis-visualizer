import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

interface Collaborator {
  user_id: string;
  role: string;
  profiles?: {
    email: string;
    role: string;
  };
}

export const useCollaboratorPermissions = (thesisId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [canManageCollaborators, setCanManageCollaborators] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkPermissions = async () => {
    try {
        setLoading(true)
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
        setError(profileError)
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
        setError(collaboratorError)
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
    } catch (error: any) {
      console.error('Error checking permissions:', error);
       setError(error)
    } finally {
        setLoading(false)
    }
  };

  const fetchCollaborators = async () => {
    try {
      setLoading(true)
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
        setError(error)
        return;
      }

      console.log('Fetched collaborators:', data);
      setCollaborators(data || []);
    } catch (error: any) {
      console.error('Error fetching collaborators:', error);
        setError(error)
    } finally {
        setLoading(false)
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