// src/hooks/useCollaboratorPermissions.tsx
import { useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { thesisService } from '@/services/thesisService';
import { Collaborator } from '@/types/collaborator';

interface CollaboratorPermissions {
  canManageCollaborators: boolean;
  currentUserRole: string | null;
  userProfile: Profile | null;
  collaborators: Collaborator[];
  loading: boolean;
  error: Error | null;
  fetchCollaborators: () => Promise<void>;
}

export const useCollaboratorPermissions = (thesisId: string): CollaboratorPermissions => {
  const queryClient = useQueryClient();

  const collaboratorsQuery = useQuery({
    queryKey: ['collaborators', thesisId],
    queryFn: () => thesisService.fetchCollaborators(thesisId),
    enabled: Boolean(thesisId),
    staleTime: 30000, // 30 seconds
  });

  const profileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      return thesisService.getUserProfile(session.user.id);
    },
    staleTime: 300000, // 5 minutes
  });

  const permissionsQuery = useQuery({
    queryKey: ['permissions', thesisId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('thesis_id', thesisId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      return data?.role || null;
    },
    enabled: Boolean(thesisId),
    staleTime: 30000,
  });

  const canManageCollaborators = useMemo(() => {
    const role = permissionsQuery.data;
    const isAdmin = profileQuery.data?.role === 'admin';
    return role === 'owner' || role === 'admin' || isAdmin;
  }, [permissionsQuery.data, profileQuery.data?.role]);

  const fetchCollaborators = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['collaborators', thesisId] });
  }, [queryClient, thesisId]);

  return {
    canManageCollaborators,
    currentUserRole: permissionsQuery.data,
    userProfile: profileQuery.data,
    collaborators: collaboratorsQuery.data || [],
    loading: collaboratorsQuery.isLoading || profileQuery.isLoading || permissionsQuery.isLoading,
    error: collaboratorsQuery.error || profileQuery.error || permissionsQuery.error,
    fetchCollaborators,
  };
};