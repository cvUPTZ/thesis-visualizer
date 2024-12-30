import React, { useState, useRef, useEffect } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { ThesisPreview } from './ThesisPreview';
import { ThesisContent } from './thesis/ThesisContent';
import { ThesisToolbar } from './thesis/ThesisToolbar';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const ThesisEditor = () => {
  const { thesisId } = useParams();
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize thesis data
  useEffect(() => {
    const fetchThesis = async () => {
      if (!thesisId) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .single();

        if (error) {
          console.error("Error fetching thesis:", error);
          setIsLoading(false);
          return;
        }

        if (data) {
          const content = data.content as {
            metadata: { description: string; keywords: string[]; createdAt: string };
            frontMatter: Section[];
            chapters: Chapter[];
            backMatter: Section[];
          };

          const thesisData: Thesis = {
            id: data.id,
            metadata: content.metadata || { description: '', keywords: [], createdAt: new Date().toISOString() },
            frontMatter: content.frontMatter || [],
            chapters: content.chapters || [],
            backMatter: content.backMatter || []
          };
          setThesis(thesisData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching thesis:", error);
        setIsLoading(false);
      }
    };

    fetchThesis();
  }, [thesisId]);

  // Only initialize hooks when thesis is available
  const shouldInitialize = thesis !== null;
  useEffect(() => {
    if (shouldInitialize) {
      useThesisAutosave(thesis);
      useThesisInitialization(thesis);
    }
  }, [shouldInitialize, thesis]);

  useEffect(() => {
    if (thesis && thesis.frontMatter.length > 0) {
      setActiveSection(thesis.frontMatter[0].id);
    }
  }, [thesis]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!thesis) {
    return <div>Thesis not found</div>;
  }

  const handleContentChange = (id: string, newContent: string) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      frontMatter: prevThesis.frontMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      ),
      backMatter: prevThesis.backMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      )
    }));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      frontMatter: prevThesis.frontMatter.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      ),
      backMatter: prevThesis.backMatter.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      )
    }));
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: 'New Chapter',
      order: thesis.chapters.length + 1,
      sections: []
    };
    setThesis(prevThesis => ({
      ...prevThesis,
      chapters: [...prevThesis.chapters, newChapter]
    }));
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      chapters: prevThesis.chapters.map(chapter =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      )
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <ThesisSidebar
        sections={[
          ...thesis.frontMatter,
          ...thesis.chapters.flatMap(chapter =>
            chapter.sections.map(section => ({
              ...section,
              title: `${chapter.title} - ${section.title}`
            }))
          ),
          ...thesis.backMatter
        ]}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
      />
      <main className="flex-1 p-8 flex">
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <ThesisToolbar
              thesisId={thesis.id}
              thesisData={thesis}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview(!showPreview)}
            />
            <ThesisContent
              frontMatter={thesis.frontMatter}
              chapters={thesis.chapters}
              backMatter={thesis.backMatter}
              activeSection={activeSection}
              onContentChange={handleContentChange}
              onTitleChange={handleTitleChange}
              onUpdateChapter={handleUpdateChapter}
              onAddChapter={handleAddChapter}
            />
          </div>
        </div>
        {showPreview && (
          <div className="w-1/2 pl-8 border-l">
            <div ref={previewRef}>
              <ThesisPreview thesis={thesis} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
