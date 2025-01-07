import React from 'react';
import { Chapter, Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { ReferenceDialog } from '../../reference/ReferenceDialog';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChapterReferencesProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterReferences: React.FC<ChapterReferencesProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const { toast } = useToast();

  const handleAddReference = (reference: Reference) => {
    if (chapter.sections[0]) {
      const updatedSections = [...chapter.sections];
      updatedSections[0] = {
        ...updatedSections[0],
        references: [...(updatedSections[0].references || []), reference]
      };

      onUpdateChapter({
        ...chapter,
        sections: updatedSections
      });

      toast({
        title: "Reference Added",
        description: "New reference has been added to the chapter",
      });
    }
  };

  const handleRemoveReference = (referenceId: string) => {
    const updatedSections = chapter.sections.map(section => ({
      ...section,
      references: section.references?.filter(r => r.id !== referenceId) || []
    }));

    onUpdateChapter({
      ...chapter,
      sections: updatedSections
    });

    toast({
      title: "Reference Removed",
      description: "Reference has been removed from the chapter",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">References</h3>
        <ReferenceDialog onAddReference={handleAddReference} />
      </div>
      <div className="space-y-2">
        {chapter.sections[0]?.references?.map((reference) => (
          <div key={reference.id} className="border p-4 rounded-lg group relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveReference(reference.id)}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <p className="font-medium">{reference.title}</p>
            <p className="text-sm text-gray-600">
              {reference.authors.join(', ')} ({reference.year})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};