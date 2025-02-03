
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Section, SectionType } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionService } from '@/services/SectionService';

interface CreateSectionDialogProps {
  thesisId: string;
  onSectionCreated: (section: Section) => void;
}

export const CreateSectionDialog: React.FC<CreateSectionDialogProps> = ({
  thesisId,
  onSectionCreated
}) => {
  const { toast } = useToast();
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<SectionType>(SectionType.CUSTOM);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCreate = async () => {
    try {
      const section = await SectionService.createSection(thesisId, title, type);
      if (section) {
        onSectionCreated(section);
        setIsOpen(false);
        setTitle('');
        setType(SectionType.CUSTOM);
        toast({
          title: "Success",
          description: "Section created successfully",
        });
      }
    } catch (error) {
      console.error('Error creating section:', error);
      toast({
        title: "Error",
        description: "Failed to create section",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section Title"
            />
          </div>
          <div className="space-y-2">
            <Select
              value={type}
              onValueChange={(value: SectionType) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SectionType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleCreate}
            className="w-full"
            disabled={!title.trim()}
          >
            Create Section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
