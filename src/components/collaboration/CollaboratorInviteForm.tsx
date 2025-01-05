import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorRole } from '@/types/collaborator';

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
  const [role, setRole] = useState<CollaboratorRole>('editor');
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !validateEmail(cleanEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .single();

      if (existingUser) {
        // Add collaborator directly if user exists
        const { error: collaboratorError } = await supabase
          .from('thesis_collaborators')
          .insert({
            thesis_id: thesisId,
            user_id: existingUser.id,
            role: role
          });

        if (collaboratorError) {
          throw collaboratorError;
        }
      } else {
        // Store pending invitation in a local storage or state management
        const pendingInvitations = JSON.parse(localStorage.getItem('pendingInvitations') || '[]');
        pendingInvitations.push({
          email: cleanEmail,
          thesisId,
          role,
          invitedAt: new Date().toISOString()
        });
        localStorage.setItem('pendingInvitations', JSON.stringify(pendingInvitations));
      }

      onInviteSuccess();
      setEmail('');
      setRole('editor');
      toast({
        title: "Success",
        description: "The collaboration invitation has been processed successfully.",
      });
    } catch (error: any) {
      console.error('Error processing invitation:', error);
      onInviteError(error);
      toast({
        title: "Error",
        description: "Failed to process invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Enter collaborator's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <Select value={role} onValueChange={(value) => setRole(value as CollaboratorRole)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="editor">Editor</SelectItem>
            {isAdmin && <SelectItem value="admin">Admin</SelectItem>}
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit"
        className="w-full"
        disabled={!email.trim()}
      >
        Send Invitation
      </Button>
    </form>
  );
};