import React, { useState, useRef, useCallback } from 'react';
import { ThesisSidebar } from '../ThesisSidebar';
import { ThesisPreview } from '../ThesisPreview';
import { ThesisContent } from '../thesis/ThesisContent';
import { ThesisToolbar } from '../thesis/ThesisToolbar';
import { Chapter, Section, ThesisSectionType } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
import { ThesisCreationModal } from '../thesis/ThesisCreationModal';
import { ThesisList } from '../thesis/ThesisList';
import { useThesisData } from '@/hooks/useThesisData';
import { Skeleton } from './skeleton';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from './resizable';
import { ScrollArea } from './scroll-area';
import { useToast } from '@/hooks/use-toast';

interface EditorProps {
  thesisId?: string;
}

export const Editor = ({ thesisId }: EditorProps) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const { thesis, setThesis, isLoading, error } = useThesisData(thesisId);

  // Initialize thesis and setup autosave
  useThesisInitialization(thesis);
  useThesisAutosave(thesis);

  const handleContentChange = useCallback((sectionId: string, content: string) => {
    if (!thesis) return;

    setThesis((prevThesis) => {
      if (!prevThesis) return prevThesis;

      const updatedThesis = { ...prevThesis };
      
      // Update front matter
      const frontMatterIndex = updatedThesis.frontMatter.findIndex(s => s.id === sectionId);
      if (frontMatterIndex !== -1) {
        updatedThesis.frontMatter[frontMatterIndex] = {
          ...updatedThesis.frontMatter[frontMatterIndex],
          content
        };
        return updatedThesis;
      }

      // Update chapters
      const updatedChapters = updatedThesis.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === sectionId ? { ...section, content } : section
        )
      }));
      updatedThesis.chapters = updatedChapters;

      // Update back matter
      const backMatterIndex = updatedThesis.backMatter.findIndex(s => s.id === sectionId);
      if (backMatterIndex !== -1) {
        updatedThesis.backMatter[backMatterIndex] = {
          ...updatedThesis.backMatter[backMatterIndex],
          content
        };
      }

      return updatedThesis;
    });
  }, [setThesis]);

  const handleTitleChange = useCallback((sectionId: string, title: string) => {
    if (!thesis) return;

    setThesis((prevThesis) => {
      if (!prevThesis) return prevThesis;

      const updatedThesis = { ...prevThesis };
      
      // Update front matter
      const frontMatterIndex = updatedThesis.frontMatter.findIndex(s => s.id === sectionId);
      if (frontMatterIndex !== -1) {
        updatedThesis.frontMatter[frontMatterIndex] = {
          ...updatedThesis.frontMatter[frontMatterIndex],
          title
        };
        return updatedThesis;
      }

      // Update chapters
      const updatedChapters = updatedThesis.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === sectionId ? { ...section, title } : section
        )
      }));
      updatedThesis.chapters = updatedChapters;

      // Update back matter
      const backMatterIndex = updatedThesis.backMatter.findIndex(s => s.id === sectionId);
      if (backMatterIndex !== -1) {
        updatedThesis.backMatter[backMatterIndex] = {
          ...updatedThesis.backMatter[backMatterIndex],
          title
        };
      }

      return updatedThesis;
    });
  }, [setThesis]);

  const getAllSections = useCallback(() => {
    if (!thesis) return [];
    return [
      ...thesis.frontMatter,
      ...thesis.chapters.flatMap(chapter => chapter.sections),
      ...thesis.backMatter
    ];
  }, [thesis]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading thesis:', error);
    return (
      <div className="p-8 text-red-500">
        Error loading thesis: {error.message}
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="p-8">
        <ThesisCreationModal />
        <ThesisList />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4">
        <ThesisToolbar
          thesisId={thesis.id}
          thesisData={thesis}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ThesisSidebar
            sections={getAllSections()}
            activeSection={activeSection}
            onSectionSelect={setActiveSection}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={showPreview ? 40 : 80}>
          <ScrollArea className="h-full">
            <div className="p-6">
              <ThesisContent
                frontMatter={thesis.frontMatter}
                chapters={thesis.chapters}
                backMatter={thesis.backMatter}
                activeSection={activeSection}
                onContentChange={handleContentChange}
                onTitleChange={handleTitleChange}
                onUpdateChapter={(chapter) => {
                  setThesis(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      chapters: prev.chapters.map(c =>
                        c.id === chapter.id ? chapter : c
                      )
                    };
                  });
                }}
                onAddChapter={() => {
                  setThesis(prev => {
                    if (!prev) return prev;
                    const newChapter: Chapter = {
                      id: Date.now().toString(),
                      title: 'New Chapter',
                      sections: []
                    };
                    return {
                      ...prev,
                      chapters: [...prev.chapters, newChapter]
                    };
                  });
                }}
              />
            </div>
          </ScrollArea>
        </ResizablePanel>

        {showPreview && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <ScrollArea className="h-full">
                <div className="p-6">
                  <ThesisPreview thesis={thesis} />
                </div>
              </ScrollArea>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};