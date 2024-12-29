// components/CollaboratorManager.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';
import { useToast } from '@/hooks/use-toast';
import { useCollaboratorPermissions } from '@/hooks/useCollaboratorPermissions';
import { Bell, BellRing } from 'lucide-react';

// ... other imports (Collaborator, Profile, etc.)


interface CollaboratorManagerProps {
    thesisId: string;
    thesisTitle: string;
}

export const CollaboratorManager = ({ thesisId, thesisTitle }: CollaboratorManagerProps) => {
    const [hasNewInvites, setHasNewInvites] = useState(false);
    const { toast } = useToast();

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
        // ... other logic (checkPermissions, fetchCollaborators)

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

    }, [thesisId, toast, fetchCollaborators]); // Include fetchCollaborators

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




    return (
        <div>
            <div onClick={handleClearNotification} className="relative ml-auto"> {/* Position as needed */}
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

            <Card> {/* Rest of the component */}
                <CardHeader>
                    <CardTitle>Collaborators</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* ... (CollaboratorInviteForm, CollaboratorList) */}
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
        </div>
    );
};