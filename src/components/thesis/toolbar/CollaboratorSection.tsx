import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { CollaboratorsList } from '../CollaboratorsList';
import { useToast } from '@/hooks/use-toast';
import { CollaboratorWithProfile } from '@/types/collaborator';

interface CollaboratorSectionProps {
  collaborators: CollaboratorWithProfile[];
  thesisId: string;
  thesisTitle: string;
  canManageCollaborators: boolean;
  isAdmin: boolean;
}

export const CollaboratorSection = ({
  collaborators,
  thesisId,
  thesisTitle,
  canManageCollaborators,
  isAdmin
}: CollaboratorSectionProps) => {
  const { toast } = useToast();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const handleInviteSuccess = () => {
    toast({
      title: "Success",
      description: "Collaborator has been invited successfully.",
    });
    setIsPopoverOpen(false);
    setIsInviting(false);
  };

  const handleInviteError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message || "Failed to invite collaborator. Please try again.",
      variant: "destructive",
    });
    setIsInviting(false);
  };

  return (
    <div className="flex items-center gap-2">
      <CollaboratorsList collaborators={collaborators} thesisId={thesisId} />
      {canManageCollaborators && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isInviting}
            >
              {isInviting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {isInviting ? 'Inviting...' : 'Add Collaborator'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Invite Collaborator</h4>
              <p className="text-sm text-muted-foreground">
                Send an invitation to collaborate on this thesis.
              </p>
              <CollaboratorInviteForm
                thesisId={thesisId}
                thesisTitle={thesisTitle}
                onInviteSuccess={handleInviteSuccess}
                onInviteError={handleInviteError}
                isAdmin={isAdmin}
                setIsInviting={setIsInviting}
              />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};