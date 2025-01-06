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
        console.log('🔄 Setting up CollaboratorManager subscription for thesis:', thesisId);
        
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.log('❌ No active session found');
                toast({
                    title: "Session Expired",
                    description: "Please log in again to continue.",
                    variant: "destructive",
                });
                return;
            }
            console.log('✅ Session active for user:', session.user.email);
        };
        
        checkSession();

        // Subscribe to thesis collaborator changes
        const channel = supabase
            .channel(`thesis_collaborators_${thesisId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'thesis_collaborators',
                    filter: `thesis_id=eq.${thesisId}`,
                },
                async (payload) => {
                    console.log('📥 New collaborator event received:', payload);
                    setHasNewInvites(true);
                    
                    try {
                        // Fetch the new collaborator's profile information
                        const { data: profileData, error: profileError } = await supabase
                            .from('profiles')
                            .select('email')
                            .eq('id', payload.new.user_id)
                            .single();

                        if (profileError) {
                            console.error('❌ Error fetching profile:', profileError);
                            throw profileError;
                        }

                        const collaboratorEmail = profileData?.email || 'A new collaborator';
                        console.log('✉️ Collaborator email:', collaboratorEmail);
                        
                        toast({
                            title: "New Collaborator Joined",
                            description: `${collaboratorEmail} has joined as a ${payload.new.role}.`,
                        });

                        // Refresh the collaborators list
                        await fetchCollaborators();
                    } catch (error) {
                        console.error('❌ Error handling new collaborator:', error);
                    }
                }
            )
            .subscribe((status) => {
                console.log('📡 Subscription status:', status);
            });

        return () => {
            console.log('🧹 Cleaning up subscription');
            supabase.removeChannel(channel);
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
        console.error('❌ Error in CollaboratorManager:', error);
        toast({
            title: "Error",
            description: error.message || "Failed to load collaborators.",
            variant: "destructive",
        });
        return null;
    }

    return (
        <div>
            <div onClick={handleClearNotification} className="relative ml-auto cursor-pointer">
                {hasNewInvites ? (
                    <BellRing className="w-6 h-6 text-blue-500 animate-bounce" />
                ) : (
                    <Bell className="w-6 h-6" />
                )}
                {hasNewInvites && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        !
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
                            onInviteSuccess={fetchCollaborators}
                            onInviteError={(error: Error) => {
                                console.error('❌ Error inviting collaborator:', error);
                                toast({
                                    title: "Error",
                                    description: error.message || "Failed to invite collaborator.",
                                    variant: "destructive",
                                });
                            }}
                            isAdmin={userProfile?.roles?.name === 'admin'}
                            setIsInviting={setIsInviting}
                        />
                    )}
                    <CollaboratorList
                        collaborators={collaborators}
                        thesisId={thesisId}
                        canManageCollaborators={canManageCollaborators}
                        currentUserRole={currentUserRole}
                        isAdmin={userProfile?.roles?.name === 'admin'}
                        onCollaboratorRemoved={fetchCollaborators}
                    />
                </CardContent>
            </Card>
        </div>
    );
};