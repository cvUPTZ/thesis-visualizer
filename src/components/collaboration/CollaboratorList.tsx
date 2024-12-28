import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Collaborator {
  user_id: string;
  role: string;
  email?: string;
}

interface CollaboratorListProps {
  collaborators: Collaborator[];
  thesisId: string;
  isOwner: boolean;
  onCollaboratorRemoved: () => void;
}

export const CollaboratorList = ({ collaborators, thesisId, isOwner, onCollaboratorRemoved }: CollaboratorListProps) => {
  const { toast } = useToast();

  const handleRemove = async (userId: string) => {
    try {
      console.log('Removing collaborator:', userId);
      
      const { error } = await supabase
        .from('thesis_collaborators')
        .delete()
        .eq('thesis_id', thesisId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed from the thesis.",
      });

      onCollaboratorRemoved();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: "An error occurred while removing the collaborator.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.user_id}
          className="flex items-center justify-between p-2 bg-muted rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span>{collaborator.email || collaborator.user_id}</span>
            <Badge variant="secondary">{collaborator.role}</Badge>
          </div>
          {isOwner && collaborator.role !== 'owner' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(collaborator.user_id)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};