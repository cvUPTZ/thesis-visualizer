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
import { Input } from "@/components/ui/input";

interface ThesisCreationModalProps {
    onThesisCreated: (thesisId: string, title: string) => void;
}

export const ThesisCreationModal = ({ onThesisCreated }: ThesisCreationModalProps) => {
   const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [universityName, setUniversityName] = useState('');
    const [departmentName, setDepartmentName] = useState('');
     const [authorName, setAuthorName] = useState('');
    const [thesisDate, setThesisDate] = useState('');
    const [committeeMembers, setCommitteeMembers] = useState(['', '', '']);

    const [error, setError] = useState<string | null>(null);
    const { createThesis, isSubmitting } = useThesisCreation();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    
    const handleCommitteeMemberChange = (index: number, value: string) => {
        const updatedMembers = [...committeeMembers];
        updatedMembers[index] = value;
        setCommitteeMembers(updatedMembers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            setError('You must be logged in to create a thesis');
            return;
        }

        const metadata = {
          title,
          description,
          keywords,
           universityName,
           departmentName,
           authorName,
           thesisDate,
          committeeMembers
      };

        const result = await createThesis(metadata, session.user.id);
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

                   <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter thesis title"
                            required
                        />
                    </div>
            
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                             placeholder="Enter a brief description of your thesis"
                              required
                        />
                    </div>

                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium mb-1">
                            Keywords
                        </label>
                        <Input
                            id="keywords"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Enter keywords separated by commas"
                            required
                        />
                    </div>
            
                   <div>
                      <label htmlFor="universityName" className="block text-sm font-medium mb-1">
                         University Name
                        </label>
                      <Input
                            id="universityName"
                            value={universityName}
                            onChange={(e) => setUniversityName(e.target.value)}
                            placeholder="Enter university name"
                            required
                        />
                    </div>
            
                   <div>
                      <label htmlFor="departmentName" className="block text-sm font-medium mb-1">
                          Department Name
                      </label>
                        <Input
                            id="departmentName"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            placeholder="Enter department name"
                            required
                        />
                    </div>
            
                    <div>
                      <label htmlFor="authorName" className="block text-sm font-medium mb-1">
                          Author Name
                      </label>
                      <Input
                          id="authorName"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Enter author name"
                          required
                      />
                  </div>

                    <div>
                      <label htmlFor="thesisDate" className="block text-sm font-medium mb-1">
                          Thesis Date
                      </label>
                        <Input
                            id="thesisDate"
                            value={thesisDate}
                            onChange={(e) => setThesisDate(e.target.value)}
                          placeholder="Enter date of thesis submission"
                          required
                      />
                    </div>
            
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Committee Members
                        </label>
                          {committeeMembers.map((member, index) => (
                                <Input
                                    key={index}
                                    value={member}
                                    onChange={(e) => handleCommitteeMemberChange(index, e.target.value)}
                                  placeholder={`Committee Member ${index + 1}`}
                                  className="mb-2"
                                />
                            ))}
                      </div>


                    <Button type="submit" disabled={isSubmitting} className="mt-6">
                        {isSubmitting ? 'Creating...' : 'Create Thesis'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};