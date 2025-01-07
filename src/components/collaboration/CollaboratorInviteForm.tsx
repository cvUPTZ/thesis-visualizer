import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CollaboratorInviteFormProps {
  thesisId: string;
  thesisTitle: string;
  onInviteSuccess: () => void;
  onInviteError: (error: Error) => void;
  isAdmin: boolean;
  setIsInviting: (isInviting: boolean) => void;
}

// Valid roles that match the database constraint
const VALID_ROLES = ['owner', 'editor', 'viewer'] as const;
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
    setIsInviting(true);
    console.log('Starting invite process for:', { email, role, thesisId });

    try {
      // First check if user exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw new Error('Error checking user profile');
      }

      if (!profiles) {
        throw new Error('User not found. Please make sure they have an account.');
      }

      // Check if user is already a collaborator
      const { data: existingCollaborator, error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .select('id, role')
        .eq('thesis_id', thesisId)
        .eq('user_id', profiles.id)
        .maybeSingle();

      if (collaboratorError && collaboratorError.code !== 'PGRST116') {
        console.error('Error checking existing collaborator:', collaboratorError);
        throw new Error('Error checking existing collaborator');
      }

      if (existingCollaborator) {
        if (existingCollaborator.role === role) {
          throw new Error(`This user is already a collaborator with role: ${role}`);
        }
        
        // Update existing collaborator's role if different
        const { error: updateError } = await supabase
          .from('thesis_collaborators')
          .update({ role })
          .eq('id', existingCollaborator.id);

        if (updateError) {
          console.error('Error updating collaborator role:', updateError);
          throw new Error('Failed to update collaborator role');
        }

        toast({
          title: "Success",
          description: `Collaborator role updated to ${role}`,
        });
        
        setEmail('');
        setRole('viewer');
        onInviteSuccess();
        return;
      }

      // Get current user's role for this thesis
      const { data: currentUserRole, error: roleError } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('thesis_id', thesisId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (roleError) {
        console.error('Error checking user role:', roleError);
        throw new Error('Error checking user permissions');
      }

      // Verify permissions
      if (!isAdmin && currentUserRole.role !== 'owner' && currentUserRole.role !== 'editor') {
        throw new Error('You do not have permission to add collaborators.');
      }

      // Add collaborator
      const { error: insertError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: profiles.id,
          role: role
        });

      if (insertError) {
        console.error('Error adding collaborator:', insertError);
        throw new Error('Failed to add collaborator. Please try again.');
      }

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: profiles.id,
          thesis_id: thesisId,
          type: 'invitation',
          message: `You have been invited to collaborate on thesis: ${thesisTitle}`
        });

      // Send invite email using edge function
      const { error: emailError } = await supabase.functions.invoke('send-invite-email', {
        body: {
          to: email,
          thesisTitle,
          inviteLink: `${window.location.origin}/thesis/${thesisId}`,
          role
        }
      });

      if (emailError) {
        console.error('Error sending invite email:', emailError);
        toast({
          title: "Notice",
          description: "Collaborator added but email notification failed to send.",
          variant: "default",
        });
      }

      toast({
        title: "Success",
        description: "Collaborator has been invited successfully.",
      });
      
      setEmail('');
      setRole('viewer');
      onInviteSuccess();
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      onInviteError(error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Select value={role} onValueChange={(value) => setRole(value as ValidRole)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            {isAdmin && <SelectItem value="owner">Owner</SelectItem>}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Send Invitation
      </Button>
    </form>
  );
};