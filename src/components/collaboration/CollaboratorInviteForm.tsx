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
    if (!email) return;

    setLoading(true);
    try {
      console.log('Looking up user by email:', email);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Error finding user:', profileError);
        toast({
          title: "User not found",
          description: "Please check the email address and try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Found user profile:', profile);

      const { error } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: profile.id,
          role: role
        });

      if (error) {
        console.error('Error adding collaborator:', error);
        toast({
          title: "Error adding collaborator",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Collaborator added",
        description: "The user has been added as a collaborator.",
      });

      setEmail('');
      setRole('editor');
      onInviteSuccess();
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: "An error occurred while adding the collaborator.",
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