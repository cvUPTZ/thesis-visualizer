import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThesisTemplateSelector } from './ThesisTemplateSelector';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

interface ThesisCreationModalProps {
  onThesisCreated?: () => void;
}

export const ThesisCreationModal: React.FC<ThesisCreationModalProps> = ({ onThesisCreated }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const handleTemplateSelect = async (template: any) => {
    try {
      console.log('Creating new thesis from template:', template);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User not authenticated');
      }

      const { data: thesis, error } = await supabase
        .from('theses')
        .insert({
          title: 'Untitled Thesis',
          content: {
            frontMatter: template.structure.frontMatter || [],
            chapters: template.structure.chapters || [],
            backMatter: template.structure.backMatter || [],
            generalIntroduction: template.structure.generalIntroduction || {
              id: 'general-introduction',
              title: 'General Introduction',
              type: 'general-introduction',
              content: ''
            },
            generalConclusion: template.structure.generalConclusion || {
              id: 'general-conclusion',
              title: 'General Conclusion',
              type: 'general-conclusion',
              content: ''
            },
            metadata: template.structure.metadata || {},
            description: template.structure.description || '',
          },
          description: template.structure.description || '',
          metadata: template.structure.metadata || {},
          frontMatter: template.structure.frontMatter || [],
          generalIntroduction: template.structure.generalIntroduction || {
            id: 'general-introduction',
            title: 'General Introduction',
            type: 'general-introduction',
            content: ''
          },
          generalConclusion: template.structure.generalConclusion || {
            id: 'general-conclusion',
            title: 'General Conclusion',
            type: 'general-conclusion',
            content: ''
          },
          backMatter: template.structure.backMatter || [],
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (!thesis) throw new Error('Failed to create thesis');

      // Add the user as an owner collaborator
      const { error: collabError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesis.id,
          user_id: session.session.user.id,
          role: 'owner'
        });

      if (collabError) throw collabError;

      console.log('Thesis created successfully:', thesis);
      
      toast({
        title: "Success",
        description: "New thesis created from template",
      });

      navigate(`/thesis/${thesis.id}`); // Redirect to the new thesis route
      setOpen(false); // Close the modal
    } catch (error: any) {
      console.error('Error creating thesis:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create thesis",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" />
          New Thesis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        <ThesisTemplateSelector onSelect={handleTemplateSelect} />
      </DialogContent>
    </Dialog>
  );
};