import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';
import { useToast } from '@/hooks/use-toast';
import { useCollaboratorPermissions } from '@/hooks/useCollaboratorPermissions';
import { Bell, BellRing } from 'lucide-react';

interface CollaboratorManagerProps {
    thesisId: string;
    thesisTitle: string;
}

export const CollaboratorManager = ({ thesisId, thesisTitle }: CollaboratorManagerProps) => {
    const [hasNewInvites, setHasNewInvites] = useState(false);
    const { toast } = useToast();
    const [isInviting, setIsInviting] = useState(false);

    const {
        collaborators,
        canManageCollaborators,
        currentUserRole,
        userProfile,
        loading,
        error,
        fetchCollaborators,
    } = useCollaboratorPermissions(thesisId);

    useEffect(() => {
        const inviteSubscription = supabase
            .channel('thesis-invites')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'thesis_collaborators',
                filter: `thesis_id=eq.${thesisId}`,
            }, (payload) => {
                console.log('New collaborator added:', payload.new);
                setHasNewInvites(true);
                toast({
                    title: "New Collaborator",
                    description: `${payload.new.profiles.email} has been added as a collaborator.`,
                });
                fetchCollaborators(); // Refetch collaborators to update the list
            })
            .subscribe();

        return () => {
            inviteSubscription.unsubscribe();
        };

    }, [thesisId, toast, fetchCollaborators]);

    const handleClearNotification = () => {
        setHasNewInvites(false);
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Loading Collaborators...</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    if (error) {
        toast({
            title: "Error",
            description: error.message || "Failed to load collaborators.",
            variant: "destructive",
        });
        return null; // Or display an error message
    }

    const handleInviteSuccess = () => {
        fetchCollaborators();
    };

    const handleInviteError = (error: Error) => {
        toast({
            title: "Error",
            description: error.message || "Failed to invite collaborator. Please try again.",
            variant: "destructive",
        });
    };

    return (
        <div>
            <div onClick={handleClearNotification} className="relative ml-auto">
                {hasNewInvites ? (
                  <BellRing className="w-6 h-6 text-blue-500 animate-bounce" />
                ) : (
                  <Bell className="w-6 h-6" />
                )}
                {hasNewInvites && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    </span>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Collaborators</CardTitle>
                </CardHeader>
                <CardContent>
                    {canManageCollaborators && (
                        <CollaboratorInviteForm
                          thesisId={thesisId}
                          thesisTitle={thesisTitle}
                          onInviteSuccess={handleInviteSuccess}
                          onInviteError={handleInviteError}
                          isAdmin={userProfile?.role === 'admin'}
                          setIsInviting={setIsInviting}
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
        </div>
    );
};
