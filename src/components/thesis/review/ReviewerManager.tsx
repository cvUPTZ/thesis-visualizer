import React, { useState } from 'react';
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
    const [reviewerEmail, setReviewerEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const assignReviewer = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        console.log('Starting assignReviewer');
        
        try {
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
                throw new Error("No user found with this email address.");
            }
            
            console.log('Profile found, user ID:', profile.id);

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
        } catch (error: any) {
            console.error('Error assigning reviewer:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to assign reviewer. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-primary hover:bg-primary-hover text-white"
                >
                    <Users className="h-4 w-4" />
                    Assign Reviewer
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-primary-light">
                <DialogHeader>
                    <DialogTitle className="text-primary-light">Assign a Reviewer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Reviewer's email"
                            value={reviewerEmail}
                            onChange={(e) => setReviewerEmail(e.target.value)}
                            className="border-primary-light focus:border-primary"
                        />
                    </div>
                    <Button
                        onClick={assignReviewer}
                        className="w-full bg-primary hover:bg-primary-hover text-white"
                        disabled={!reviewerEmail.trim() || isLoading}
                    >
                        {isLoading ? "Assigning..." : "Assign Reviewer"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};