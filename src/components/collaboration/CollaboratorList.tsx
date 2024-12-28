import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Collaborator {
  user_id: string;
  role: string;
  profiles?: {
    email: string;
    role: string;
  };
}

interface CollaboratorListProps {
  collaborators: Collaborator[];
  thesisId: string;
  canManageCollaborators: boolean;
  currentUserRole: string | null;
  isAdmin: boolean;
  onCollaboratorRemoved: () => void;
}


const getBadgeVariant = (role: string) => {
    if(role === 'owner') return "default";
    if(role === 'admin') return "secondary";
    return 'muted'
}

const canRemoveCollaborator = (isAdmin: boolean, currentUserRole: string | null, collaborator: Collaborator) => {
    if (isAdmin) return true;
    if (currentUserRole === 'owner') return true;
    if (currentUserRole === 'admin' && collaborator.role !== 'owner') return true;
    return false;
  };

export const CollaboratorList = ({ 
  collaborators, 
  thesisId, 
  canManageCollaborators,
  currentUserRole,
  isAdmin,
  onCollaboratorRemoved 
}: CollaboratorListProps) => {
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
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while removing the collaborator.",
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
            <span>{collaborator.profiles?.email || collaborator.user_id}</span>
            <Badge variant={getBadgeVariant(collaborator.role)}>{collaborator.role}</Badge>
            {collaborator.profiles?.role === 'admin' && (
              <Badge variant="default">Site Admin</Badge>
            )}
          </div>
          {canManageCollaborators && canRemoveCollaborator(isAdmin, currentUserRole, collaborator) && (
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