import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';
import { thesisService } from '@/services/thesisService';
import { Collaborator } from '@/types/collaborator';

export const useCollaboratorPermissions = (thesisId: string) => {
    const [canManageCollaborators, setCanManageCollaborators] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);

    const { data: collaborators, isLoading, error } = useQuery({
        queryKey: ['collaborators', thesisId],
        queryFn: () => thesisService.fetchCollaborators(thesisId),
        enabled: !!thesisId,
    });

    const { data: profileData } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if(!session) return null;
            return thesisService.getUserProfile(session.user.id);
        }
    });

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                if (!profileData) return;
                setUserProfile(profileData);

                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    console.log('No session found');
                    return;
                }

                const { data: collaboratorData } = await supabase
                    .from('thesis_collaborators')
                    .select('role')
                    .eq('thesis_id', thesisId)
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                const role = collaboratorData?.role;
                setCurrentUserRole(role || null);
                
                const isAdmin = profileData.role === 'admin';
                const isOwnerOrAdmin = role === 'owner' || role === 'admin' || isAdmin;
                
                setCanManageCollaborators(isOwnerOrAdmin);

            } catch (error: any) {
                console.error('Error checking permissions:', error);
                throw new Error(error.message);
            }
        };

        if (thesisId && profileData) {
            checkPermissions();
        }

    }, [thesisId, profileData]);

    return {
        collaborators: collaborators as Collaborator[],
        canManageCollaborators,
        currentUserRole,
        userProfile,
        loading: isLoading,
        error,
        fetchCollaborators: () => {
            return void (async () => {
                return void await supabase.from('thesis_collaborators').select('*').eq('thesis_id', thesisId);
            })();
        },
    };
};