// File: src/components/thesis/ThesisCreationModal.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { ThesisMetadataFields } from './form/ThesisMetadataFields';
import { useThesisCreation } from './form/useThesisCreation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ThesisCreationModalProps {
    onThesisCreated: (thesisId: string, title: string) => void;
}

export const ThesisCreationModal = ({ onThesisCreated }: ThesisCreationModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { createThesis, isSubmitting } = useThesisCreation();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            setError('You must be logged in to create a thesis');
            return;
        }

        const result = await createThesis(title, description, keywords, session.user.id);
        if (result?.thesisId) {
            setOpen(false);
            onThesisCreated(result.thesisId, title);
           navigate(`/thesis/${result.thesisId}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create New Thesis</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl mx-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New Thesis</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <ThesisMetadataFields
                        title={title}
                        description={description}
                        keywords={keywords}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        setKeywords={setKeywords}
                    />

                    <Button type="submit" disabled={isSubmitting} className="mt-6">
                        {isSubmitting ? 'Creating...' : 'Create Thesis'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};