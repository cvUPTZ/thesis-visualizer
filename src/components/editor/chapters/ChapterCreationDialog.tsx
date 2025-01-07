import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Chapter, Section } from '@/types/thesis';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChapterCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChapterCreate: (chapter: Chapter) => void;
}

export const ChapterCreationDialog: React.FC<ChapterCreationDialogProps> = ({
  open,
  onOpenChange,
  onChapterCreate,
}) => {
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [sections, setSections] = useState<Partial<Section>[]>([]);
  const { toast } = useToast();

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: '',
        content: '',
        type: 'custom',
        order: sections.length + 1,
        figures: [],
        tables: [],
        citations: [],
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
    setSections(
      sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Chapter title is required",
        variant: "destructive",
      });
      return;
    }

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: title.trim(),
      content: introduction,
      order: 1,
      sections: sections as Section[],
    };

    onChapterCreate(newChapter);
    onOpenChange(false);
    
    // Reset form
    setTitle('');
    setIntroduction('');
    setSections([]);

    toast({
      title: "Success",
      description: "Chapter created successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Create New Chapter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chapter Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chapter title"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chapter Introduction</label>
            <MarkdownEditor
              value={introduction}
              onChange={setIntroduction}
              placeholder="Write your chapter introduction..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Sections</h3>
              <Button
                onClick={handleAddSection}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Section
              </Button>
            </div>

            {sections.map((section, index) => (
              <div key={section.id} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <Input
                    value={section.title}
                    onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                    placeholder="Section title"
                    className="flex-1 mr-2"
                  />
                  <Button
                    onClick={() => handleRemoveSection(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <MarkdownEditor
                  value={section.content}
                  onChange={(value) => handleSectionChange(index, 'content', value)}
                  placeholder="Write your section content..."
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="ml-2">
            Create Chapter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};