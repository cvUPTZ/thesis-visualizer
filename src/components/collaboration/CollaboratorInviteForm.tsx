import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      const cleanEmail = email.toLowerCase().trim();
      const inviteLink = `${window.location.origin}/auth?thesisId=${thesisId}&role=${role}`;
      
      // Here you would typically send an email with the invite link
      // For now, we'll show it in a toast message
      toast({
        title: "Invitation Link Generated",
        description: `Share this link with ${cleanEmail}: ${inviteLink}`,
      });

      setEmail('');
      setRole('editor');
      onInviteSuccess();
    } catch (error) {
      console.error('Error generating invite link:', error);
      toast({
        title: "Error",
        description: "An error occurred while generating the invitation link.",
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