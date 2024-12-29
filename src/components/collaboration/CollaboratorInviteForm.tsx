// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { UserPlus } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';

// interface CollaboratorInviteFormProps {
//   thesisId: string;
//   onInviteSuccess: () => void;
//   isAdmin: boolean;
//   thesisTitle: string;
// }

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export const CollaboratorInviteForm = ({
//   thesisId,
//   onInviteSuccess,
//   isAdmin,
//   thesisTitle
// }: CollaboratorInviteFormProps) => {
//     const [email, setEmail] = useState('');
//     const [role, setRole] = useState('editor');
//     const [loading, setLoading] = useState(false);
//     const { toast } = useToast();

//     const sanitizeEmail = (email: string) => {
//         return email.toLowerCase().trim().replace(/\s+/g, '');
//     };

//     const handleInvite = async () => {
//         if (!email) {
//             toast({
//                 title: "Email required",
//                 description: "Please enter an email address.",
//                 variant: "destructive",
//             });
//             return;
//         }

//         if (!emailRegex.test(email)) {
//             toast({
//                 title: "Invalid Email",
//                 description: "Please enter a valid email address.",
//                 variant: "destructive",
//             });
//             return;
//         }

//         setLoading(true);
//         try {
//             const cleanEmail = sanitizeEmail(email);
//             console.log('Email Before Sanitization:', email);
//             console.log('Email After Sanitization:', cleanEmail);

//             const inviteLink = `${window.location.origin}/auth?thesisId=${thesisId}&role=${role}`;
//             console.log('Sending invitation email...');

//             // Call the Supabase Edge Function to send the invitation email
//             const { data, error: emailError } = await supabase.functions.invoke('send-invite-email', {
//                 body: {
//                     to: cleanEmail,
//                     thesisTitle,
//                     inviteLink,
//                     role
//                 },
//             });

//             if (emailError) {
//                 console.error('Error sending invitation email:', emailError);
//                   if (emailError.message.includes("already a collaborator")) {
//                     toast({
//                         title: "Invitation Error",
//                          description: "User is already a collaborator on the thesis.",
//                          variant: "destructive",
//                     })
//                       return;
//                   }

//                 toast({
//                     title: "Error",
//                     description: `Failed to send the invitation. ${emailError.message || 'Please try again.'}`,
//                     variant: "destructive",
//                 });
//                 return;
//             }


//             console.log('Invitation email sent successfully:', data);

//             toast({
//                 title: "Invitation Sent",
//                 description: `An invitation email has been sent to ${cleanEmail}`,
//             });

//             setEmail('');
//             setRole('editor');
//             onInviteSuccess();
//         } catch (error: any) {
//             console.error('Error sending invitation:', error);
//             toast({
//                 title: "Error",
//                 description: error.message || "Failed to send the invitation. Please try again.",
//                 variant: "destructive",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex gap-2">
//             <Input
//                 placeholder="Enter collaborator's email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 className="flex-1"
//             />
//             <Select value={role} onValueChange={setRole}>
//                 <SelectTrigger className="w-[120px]">
//                     <SelectValue placeholder="Select role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="editor">Editor</SelectItem>
//                     {isAdmin && <SelectItem value="admin">Admin</SelectItem>}
//                 </SelectContent>
//             </Select>
//             <Button
//                 onClick={handleInvite}
//                 disabled={loading || !email}
//                 className="gap-2"
//             >
//                 <UserPlus className="w-4 h-4" />
//                 Invite
//             </Button>
//         </div>
//     );
// };










import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
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
      const inviteLink = `${window.location.origin}/auth?thesisId=${thesisId}&role=${role}`;

      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: JSON.stringify({
          to: cleanEmail,
          thesisTitle,
          inviteLink,
          role
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (error) throw error;
      onInviteSuccess();
      setEmail('');
      setRole('editor');

    } catch (error: any) {
      console.error('Error sending invitation:', error);
      onInviteError(error);
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