// File: src/components/collaboration/CollaboratorInviteForm.tsx
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
      // Fix: Remove any trailing slashes and ensure proper URL formatting
      const baseUrl = window.location.origin.replace(/\/$/, '');
      const inviteLink = `${baseUrl}/auth?thesisId=${thesisId}&role=${role}`;

      console.log('Sending invitation with link:', inviteLink); // Debug log

      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          to: cleanEmail,
          thesisTitle,
          inviteLink,
          role
        },
      });

      if (error) {
        console.error('Error from edge function:', error); // Debug log
        
        // Check if it's a domain verification error
        if (error.message?.includes('Domain verification required')) {
          toast({
            title: "Domain Verification Required",
            description: "Please verify your email domain at Resend.com before sending invitations.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        onInviteSuccess();
        setEmail('');
        setRole('editor');
        toast({
          title: "Invitation Sent",
          description: "The collaboration invitation has been sent successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      onInviteError(error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
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