import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';
import { NotificationBell } from './NotificationBell';
import { useCollaborationSubscription } from './CollaborationSubscription';
import { useToast } from '@/hooks/use-toast';
import { useCollaboratorPermissions } from '@/hooks/useCollaboratorPermissions';

interface CollaboratorManagerProps {
  thesisId: string;
  thesisTitle: string;
}

export const CollaboratorManager = ({ 
  thesisId, 
  thesisTitle 
}: CollaboratorManagerProps) => {
  const [hasNewInvites, setHasNewInvites] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
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

  const handleCollaboratorJoined = (email: string, role: string) => {
    console.log('🎉 New collaborator joined:', { email, role });
    setHasNewInvites(true);
    toast({
      title: "New Collaborator Joined",
      description: `${email} has joined as a ${role}.`,
    });
    fetchCollaborators();
  };

  const handleSubscriptionError = (error: Error) => {
    console.error('❌ Subscription error:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to process collaborator update.",
      variant: "destructive",
    });
  };

  useCollaborationSubscription({
    thesisId,
    onCollaboratorJoined: handleCollaboratorJoined,
    onError: handleSubscriptionError,
  });

  const handleClearNotification = () => {
    console.log('🔔 Clearing notification state');
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
      <NotificationBell 
        hasNewInvites={hasNewInvites}
        onClear={handleClearNotification}
      />

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