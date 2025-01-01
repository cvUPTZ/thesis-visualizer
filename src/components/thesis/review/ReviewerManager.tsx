// In src/components/thesis/review/ReviewerManager.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

interface ReviewerManagerProps {
    thesisId: string;
}

export const ReviewerManager = ({ thesisId }: ReviewerManagerProps) => {
    const { toast } = useNotification();
    const [reviewerEmail, setReviewerEmail] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);


    const assignReviewer = async () => {
        console.log('Starting assignReviewer');
        try {
            // First get the user profile by email
            console.log('Fetching profile for email:', reviewerEmail);
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', reviewerEmail)
                .single();

            if (profileError) {
                 console.error('Error fetching profile:', profileError);
                 throw new Error(profileError.message);
            }

            if (!profile) {
                console.log('User not found with email:', reviewerEmail);
                toast({
                   title: "User not found",
                    description: "No user found with this email address.",
                    variant: "destructive",
                });
                return;
            }
            console.log('Profile found, user ID:', profile.id);


            // Add reviewer role in thesis_collaborators
             console.log('Inserting reviewer to thesis_collaborators:', thesisId, profile.id);
           const { error: collaboratorError } = await supabase
              .from('thesis_collaborators')
                 .insert({
                      thesis_id: thesisId,
                     user_id: profile.id,
                    role: 'reviewer'
                });

           if (collaboratorError) {
               console.error('Error inserting collaborator:', collaboratorError);
                throw new Error(collaboratorError.message);
            }
           console.log('Successfully inserted reviewer to thesis_collaborators');
            toast({
                title: "Reviewer assigned",
                description: "The reviewer has been successfully assigned to this thesis.",
            });
            setReviewerEmail('');
            setIsOpen(false);
           console.log('setIsopen to false')
       } catch (error: any) {
           console.error('Error assigning reviewer:', error);
           toast({
                title: "Error",
                description: error.message || "Failed to assign reviewer. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(value) => {
             setIsOpen(value)
                console.log('Modal state changed:', value)
            }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Assign Reviewer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign a Reviewer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Reviewer's email"
                            value={reviewerEmail}
                            onChange={(e) => setReviewerEmail(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={assignReviewer}
                        className="w-full"
                        disabled={!reviewerEmail.trim()}
                    >
                       Assign Reviewer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};