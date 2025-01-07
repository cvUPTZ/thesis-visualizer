import React from 'react';
import { Chapter, Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { CitationSearch } from '../../citation/CitationSearch';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChapterCitationsProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterCitations: React.FC<ChapterCitationsProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const { toast } = useToast();

  const handleAddCitation = (citation: Omit<Citation, "thesis_id">) => {
    if (chapter.sections[0]) {
      const updatedSections = [...chapter.sections];
      updatedSections[0] = {
        ...updatedSections[0],
        citations: [...(updatedSections[0].citations || []), { ...citation, thesis_id: chapter.id }]
      };

      onUpdateChapter({
        ...chapter,
        sections: updatedSections
      });

      toast({
        title: "Citation Added",
        description: "New citation has been added to the chapter",
      });
    }
  };

  const handleRemoveCitation = (citationId: string) => {
    const updatedSections = chapter.sections.map(section => ({
      ...section,
      citations: section.citations.filter(c => c.id !== citationId)
    }));

    onUpdateChapter({
      ...chapter,
      sections: updatedSections
    });

    toast({
      title: "Citation Removed",
      description: "Citation has been removed from the chapter",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Citations</h3>
        <CitationSearch onCitationSelect={handleAddCitation} />
      </div>
      <div className="space-y-2">
        {chapter.sections[0]?.citations?.map((citation) => (
          <div key={citation.id} className="border p-4 rounded-lg group relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCitation(citation.id)}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <p className="font-medium">{citation.text}</p>
            <p className="text-sm text-gray-600">
              {citation.authors.join(', ')} ({citation.year})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};