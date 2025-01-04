import React, { useState, useRef, useCallback } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { ThesisPreview } from './ThesisPreview';
import { ThesisContent } from './thesis/ThesisContent';
import { ThesisToolbar } from './thesis/ThesisToolbar';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
import { ThesisCreationModal } from './thesis/ThesisCreationModal';
import { ThesisList } from './thesis/ThesisList';
import { useThesisData } from '@/hooks/useThesisData';
import { Skeleton } from './ui/skeleton';
import { EditorLayout } from './editor/layout/EditorLayout';

export const ThesisEditor = () => {
  const { thesisId } = useParams();
  const { thesis, setThesis, isLoading, error } = useThesisData(thesisId);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useThesisAutosave(thesis);
  useThesisInitialization(thesis);

  const handleThesisCreated = (thesisId: string, title: string) => {
    console.log("Thesis created:", { thesisId, title });
    setThesis(null);
  };

  const handleContentChange = useCallback((id: string, newContent: string) => {
    if (!thesis) return;
    
    setThesis((prevThesis: Thesis | null) => {
      if (!prevThesis) return thesis;
      
      const updatedThesis = {
        ...prevThesis,
        frontMatter: prevThesis.frontMatter.map(section =>
          section.id === id ? { ...section, content: newContent } : section
        ),
        chapters: prevThesis.chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section =>
            section.id === id ? { ...section, content: newContent } : section
          )
        })),
        backMatter: prevThesis.backMatter.map(section =>
          section.id === id ? { ...section, content: newContent } : section
        )
      };
      return updatedThesis;
    });
  }, [thesis, setThesis]);

  const getAllThesisSections = () => {
    if (!thesis) return [];
    return [
      ...thesis.frontMatter,
      ...thesis.chapters.flatMap(chapter => chapter.sections),
      ...thesis.backMatter
    ];
  };

  const handleTitleChange = (chapterId: string, newTitle: string) => {
    if (!thesis) return;
    
    setThesis((prevThesis: Thesis | null) => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        chapters: prevThesis.chapters.map(chapter =>
          chapter.id === chapterId ? { ...chapter, title: newTitle } : chapter
        )
      };
    });
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    if (!thesis) return;
    
    setThesis((prevThesis: Thesis | null) => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        chapters: prevThesis.chapters.map(chapter =>
          chapter.id === updatedChapter.id ? updatedChapter : chapter
        )
      };
    });
  };

  const handleAddChapter = () => {
    if (!thesis) return;
    
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: 'New Chapter',
      order: thesis.chapters.length + 1,
      sections: []
    };
    
    setThesis((prevThesis: Thesis | null) => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        chapters: [...prevThesis.chapters, newChapter]
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-fade-in">
        <div className="flex h-screen">
          <Skeleton className="w-64 h-full" />
          <div className="flex-1 p-8">
            <Skeleton className="h-12 w-full mb-6" />
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Error Loading Thesis</h2>
          <p className="text-muted-foreground">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!thesis && !thesisId) {
    return (
      <div className="flex flex-col h-screen animate-fade-in">
        <div className="flex justify-between p-4 items-center border-b">
          <ThesisCreationModal onThesisCreated={handleThesisCreated} />
          <ThesisList />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">No thesis loaded</p>
        </div>
      </div>
    );
  }

  if (!thesis) return null;

  return (
    <EditorLayout
      sidebar={
        <ThesisSidebar
          sections={getAllThesisSections()}
          activeSection={activeSection}
          onSectionSelect={setActiveSection}
        />
      }
      content={
        <>
          <ThesisToolbar
            thesisId={thesis.id}
            thesisData={thesis}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
          />
          <div className="mt-6">
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
        </>
      }
      preview={showPreview ? <ThesisPreview thesis={thesis} /> : undefined}
      showPreview={showPreview}
    />
  );
};