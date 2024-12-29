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
  thesisTitle: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CollaboratorInviteForm = ({
  thesisId,
  onInviteSuccess,
  isAdmin,
  thesisTitle
}: CollaboratorInviteFormProps) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('editor');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const sanitizeEmail = (email: string) => {
        return email.toLowerCase().trim().replace(/\s+/g, ''); // Added replace to remove any whitespace characters

    };

    const handleInvite = async () => {
        if (!email) {
            toast({
                title: "Email required",
                description: "Please enter an email address.",
                variant: "destructive",
            });
            return;
        }

        if (!emailRegex.test(email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const cleanEmail = sanitizeEmail(email);
            console.log('Email Before Sanitization:', email);
             console.log('Email After Sanitization:', cleanEmail);

            const inviteLink = `${window.location.origin}/auth?thesisId=${thesisId}&role=${role}`;

            console.log('Sending invitation email...');
            // Check for existing collaborator invitation
             const { data: existingCollaborator, error: checkError } = await supabase
              .from('thesis_collaborators')
              .select('*')
              .eq('thesis_id', thesisId)
              .eq('user_id', cleanEmail);


      if (checkError && checkError.code !== 'PGRST116') { //check if not "no data found" error
          console.error('Error checking existing collaborator:', checkError);
          toast({
            title: "Error",
            description: "Failed to send the invitation. Please try again.",
            variant: "destructive",
          });
         return;
      }


            if(existingCollaborator) {
                toast({
                    title: "Invitation Error",
                    description: "User is already a collaborator on the thesis.",
                    variant: "destructive",
                });
                return;
            }

            const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-invite-email', {
                body: {
                    to: cleanEmail,
                    thesisTitle,
                    inviteLink,
                    role
                },
            });

            if (emailError) {
                console.error('Error sending invitation email:', emailError);
               toast({
                    title: "Error",
                    description: `Failed to send the invitation. ${emailError.message || 'Please try again.'}`,
                    variant: "destructive",
                });
                return;
            }

            console.log('Invitation email sent successfully:', emailResponse);

            toast({
                title: "Invitation Sent",
                description: `An invitation email has been sent to ${cleanEmail}`,
            });

            setEmail('');
            setRole('editor');
            onInviteSuccess();
        } catch (error: any) {
            console.error('Error sending invitation:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to send the invitation. Please try again.",
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