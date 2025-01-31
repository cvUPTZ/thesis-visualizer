import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CollaboratorInviteFormProps {
  thesisId: string;
  thesisTitle: string;
  onInviteSuccess: () => void;
  onInviteError: (error: Error) => void;
  isAdmin: boolean;
  setIsInviting: (isInviting: boolean) => void;
}

const VALID_ROLES = ['editor', 'viewer'] as const;
type ValidRole = typeof VALID_ROLES[number];

export const CollaboratorInviteForm = ({
  thesisId,
  thesisTitle,
  onInviteSuccess,
  onInviteError,
  isAdmin,
  setIsInviting
}: CollaboratorInviteFormProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ValidRole>('viewer');
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !role || !thesisId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting invite process for:', { email, role, thesisId });
    setIsInviting(true);

    try {
      // First check if the user exists
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (userError) {
        console.error('Error checking user:', userError);
        throw new Error('Error checking user existence');
      }

      if (!existingUser) {
        throw new Error('User not found. Please ensure the email is correct.');
      }

      // Check if user is already a collaborator
      const { data: existingCollaborator, error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .select('*')
        .eq('thesis_id', thesisId)
        .eq('user_id', existingUser.id)
        .maybeSingle();

      if (collaboratorError) {
        console.error('Error checking existing collaborator:', collaboratorError);
        throw new Error('Error checking existing collaborator');
      }

      if (existingCollaborator) {
        // If collaborator exists with same role, show error
        if (existingCollaborator.role === role) {
          throw new Error('User is already a collaborator with this role');
        }

        // If collaborator exists with different role, update role
        const { error: updateError } = await supabase
          .from('thesis_collaborators')
          .update({ role })
          .eq('thesis_id', thesisId)
          .eq('user_id', existingUser.id);

        if (updateError) {
          console.error('Error updating collaborator role:', updateError);
          throw new Error('Failed to update collaborator role');
        }

        toast({
          title: "Success",
          description: `Collaborator role updated to ${role}`,
        });
      } else {
        // Add new collaborator
        const { error: insertError } = await supabase
          .from('thesis_collaborators')
          .insert({
            thesis_id: thesisId,
            user_id: existingUser.id,
            role: role
          });

        if (insertError) {
          console.error('Error adding collaborator:', insertError);
          throw new Error('Failed to add collaborator. Please try again.');
        }

        // Create a notification for the invited user
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: existingUser.id,
            thesis_id: thesisId,
            type: 'invitation',
            message: `You have been invited to collaborate on "${thesisTitle}" as a ${role}`
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
          // Don't throw here as the collaboration was successful
        }

        toast({
          title: "Success",
          description: "Collaborator added successfully",
        });
      }

      setEmail('');
      onInviteSuccess();
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      onInviteError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite collaborator",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter collaborator's email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as ValidRole)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {VALID_ROLES.map((validRole) => (
              <SelectItem key={validRole} value={validRole}>
                {validRole.charAt(0).toUpperCase() + validRole.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Send Invitation
      </Button>
    </form>
  );
};