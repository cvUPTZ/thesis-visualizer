import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorList } from './CollaboratorList';
import { Profile } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';
import { useCollaboratorPermissions } from '@/hooks/useCollaboratorPermissions';

interface CollaboratorManagerProps {
  thesisId: string;
  thesisTitle: string;
}

export const CollaboratorManager = ({ thesisId, thesisTitle }: CollaboratorManagerProps) => {
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


    if(loading) {
        return (
          <Card className="border-2 border-editor-border">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Loading Collaborators...</CardTitle>
            </CardHeader>
          </Card>
        );
    }

    if(error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load collaborators.",
          variant: "destructive",
        });
    }


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