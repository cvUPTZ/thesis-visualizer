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

export const CollaboratorInviteForm = ({
  thesisId,
  thesisTitle,
  onInviteSuccess,
  onInviteError,
  isAdmin,
  setIsInviting
}: CollaboratorInviteFormProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('viewer');
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);

    try {
      // First check if user exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single();

      if (profileError || !profiles) {
        throw new Error('User not found. Please make sure they have an account.');
      }

      // Check if user is already a collaborator
      const { data: existingCollaborator } = await supabase
        .from('thesis_collaborators')
        .select('id')
        .eq('thesis_id', thesisId)
        .eq('user_id', profiles.id)
        .single();

      if (existingCollaborator) {
        throw new Error('This user is already a collaborator.');
      }

      // Add collaborator
      const { error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: profiles.id,
          role: role
        });

      if (collaboratorError) {
        console.error('Error adding collaborator:', collaboratorError);
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
        // Don't throw here, as the collaboration was already created
        toast({
          title: "Warning",
          description: "Collaborator added but email notification failed to send.",
          variant: "warning",
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
        <Select value={role} onValueChange={setRole}>
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