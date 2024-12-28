import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CollaboratorInviteForm } from '../../collaboration/CollaboratorInviteForm';
import { CollaboratorsList } from '../CollaboratorsList';
import { useToast } from '@/hooks/use-toast';

interface CollaboratorSectionProps {
  collaborators: any[];
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

  const handleInviteSuccess = () => {
    toast({
      title: "Success",
      description: "Collaborator has been invited successfully.",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <CollaboratorsList collaborators={collaborators} thesisId={thesisId} />
      {canManageCollaborators && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Collaborator
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <CollaboratorInviteForm
              thesisId={thesisId}
              thesisTitle={thesisTitle}
              onInviteSuccess={handleInviteSuccess}
              isAdmin={isAdmin}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};