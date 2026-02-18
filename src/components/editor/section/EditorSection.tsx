import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { Section } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';
import { validate as validateUUID } from 'uuid';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis } = useThesisData(thesisId);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!thesis || !sectionId) return;
    
    const loadSection = async () => {
      try {
        setIsLoading(true);
        if (!validateUUID(sectionId)) {
          throw new Error('Invalid section ID format');
        }
        const found = findSection();
        if (found) setSection(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load section');
      } finally {
        setIsLoading(false);
      }
    };

    loadSection();
  }, [thesis, sectionId]);

  const findSection = (): Section | null => {
    if (!thesis || !sectionId) return null;
    const content = thesis.content;
    if (!content) return null;

    if (content.generalIntroduction?.id === sectionId) return content.generalIntroduction;
    if (content.generalConclusion?.id === sectionId) return content.generalConclusion;

    const fm = content.frontMatter?.find((s: any) => s.id === sectionId);
    if (fm) return fm;

    const bm = content.backMatter?.find((s: any) => s.id === sectionId);
    if (bm) return bm;

    if (content.chapters) {
      for (const chapter of content.chapters) {
        const s = chapter.sections?.find((s: any) => s.id === sectionId);
        if (s) return s;
      }
    }

    return null;
  };

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section) return;

    try {
      const updatedThesis = { ...thesis, content: { ...thesis.content } };
      const c = updatedThesis.content;

      if (section.id === c.generalIntroduction?.id) {
        c.generalIntroduction = { ...c.generalIntroduction, content: newContent };
      } else if (section.id === c.generalConclusion?.id) {
        c.generalConclusion = { ...c.generalConclusion, content: newContent };
      } else {
        const fmIdx = c.frontMatter?.findIndex((s: any) => s.id === section.id) ?? -1;
        if (fmIdx !== -1) {
          c.frontMatter[fmIdx] = { ...c.frontMatter[fmIdx], content: newContent };
        } else {
          c.chapters = c.chapters.map((ch: any) => ({
            ...ch,
            sections: ch.sections.map((s: any) =>
              s.id === section.id ? { ...s, content: newContent } : s
            )
          }));
        }
      }

      setThesis(updatedThesis);
      setSection({ ...section, content: newContent });
    } catch (err) {
      console.error('Error updating section:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-destructive">{error || 'Section not found'}</h1>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">{section.title}</h1>
        <MarkdownEditor
          value={typeof section.content === 'string' ? section.content : ''}
          onChange={handleContentChange}
          placeholder="Start writing your section content..."
        />
      </Card>
    </div>
  );
}
