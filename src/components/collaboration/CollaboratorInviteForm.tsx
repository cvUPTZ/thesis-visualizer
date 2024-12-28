import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CollaboratorInviteFormProps {
  thesisId: string;
  onInviteSuccess: () => void;
  isAdmin: boolean;
}

export const CollaboratorInviteForm = ({ 
  thesisId, 
  onInviteSuccess,
  isAdmin 
}: CollaboratorInviteFormProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Looking up user by email:', email);
      
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase().trim());

      if (profileError) {
        console.error('Error finding user:', profileError);
        toast({
          title: "Error",
          description: "An error occurred while looking up the user.",
          variant: "destructive",
        });
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('No user found with email:', email);
        toast({
          title: "User not found",
          description: "No user found with this email address. Please check the email and try again.",
          variant: "destructive",
        });
        return;
      }

      const profile = profiles[0];
      console.log('Found user profile:', profile);

      // Check if user is already a collaborator
      const { data: existingCollaborator, error: collaboratorCheckError } = await supabase
        .from('thesis_collaborators')
        .select('*')
        .eq('thesis_id', thesisId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (collaboratorCheckError) {
        console.error('Error checking existing collaborator:', collaboratorCheckError);
        toast({
          title: "Error",
          description: "An error occurred while checking existing collaborators.",
          variant: "destructive",
        });
        return;
      }

      if (existingCollaborator) {
        toast({
          title: "Already a collaborator",
          description: "This user is already a collaborator on this thesis.",
          variant: "destructive",
        });
        return;
      }

      const { error: insertError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: profile.id,
          role: role
        });

      if (insertError) {
        console.error('Error adding collaborator:', insertError);
        toast({
          title: "Error adding collaborator",
          description: insertError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Collaborator added",
        description: `${email} has been added as a collaborator with ${role} role.`,
      });

      setEmail('');
      setRole('editor');
      onInviteSuccess();
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the collaborator.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter collaborator's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="flex-1"
      />
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="editor">Editor</SelectItem>
          {isAdmin && <SelectItem value="admin">Admin</SelectItem>}
        </SelectContent>
      </Select>
      <Button
        onClick={handleInvite}
        disabled={loading || !email}
        className="gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Invite
      </Button>
    </div>
  );
};