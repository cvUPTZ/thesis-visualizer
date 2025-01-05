import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorRole } from '@/types/collaborator';
import nodemailer from 'nodemailer';

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

  const sendInviteEmail = async (to: string, inviteLink: string, role: string) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to,
        subject: `Invitation to collaborate on thesis: ${thesisTitle}`,
        html: `
          <h2>You've been invited to collaborate!</h2>
          <p>You have been invited to collaborate on the thesis "${thesisTitle}" as a ${role}.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
            Accept Invitation
          </a>
          <p>If you can't click the button, copy and paste this link in your browser:</p>
          <p>${inviteLink}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send invitation email');
    }
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
      const baseUrl = window.location.origin.replace(/\/$/, '');
      const inviteLink = `${baseUrl}/auth?thesisId=${thesisId}&role=${role}`;

      console.log('Sending invitation with link:', inviteLink);

      await sendInviteEmail(cleanEmail, inviteLink, role);
      
      onInviteSuccess();
      setEmail('');
      setRole('editor');
      toast({
        title: "Success",
        description: "The collaboration invitation has been sent successfully.",
      });
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