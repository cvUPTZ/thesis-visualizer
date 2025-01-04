import React, { useState, useRef, useCallback } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { ThesisPreview } from './ThesisPreview';
import { ThesisContent } from './thesis/ThesisContent';
import { ThesisToolbar } from './thesis/ThesisToolbar';
import { Chapter, Section, ThesisSectionType, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
import { ThesisCreationModal } from './thesis/ThesisCreationModal';
import { ThesisList } from './thesis/ThesisList';
import { useThesisData } from '@/hooks/useThesisData';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { ScrollArea } from './ui/scroll-area';

interface ThesisEditorProps {
  thesisId?: string;
}

export const ThesisEditor = ({ thesisId: propsThesisId }: ThesisEditorProps) => {
  const { thesisId: routeThesisId } = useParams();
  const currentThesisId = propsThesisId || routeThesisId;
  
  const { thesis, setThesis, isLoading, error } = useThesisData(currentThesisId);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize hooks
  useThesisAutosave(thesis);
  useThesisInitialization(thesis);

  const handleThesisCreated = (thesisId: string, title: string) => {
    console.log("Thesis created, setting thesis to null:", thesisId, title);
    setThesis(null);
  };

  const handleContentChange = (id: string, newContent: string) => {
    if (!thesis) return;
    
    setThesis((prevThesis: Thesis | null): Thesis => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        frontMatter: prevThesis.frontMatter.map(section =>
          section.id === id ? { ...section, content: newContent } : section
        ),
        chapters: prevThesis.chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section => (
            section.id === id ? { ...section, content: newContent } : section
          ))
        })),
        backMatter: prevThesis.backMatter.map(section =>
          section.id === id ? { ...section, content: newContent } : section
        )
      };
    });
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    if (!thesis) return;

    setThesis((prevThesis: Thesis | null): Thesis => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        frontMatter: prevThesis.frontMatter.map(section =>
          section.id === id ? { ...section, title: newTitle } : section
        ),
        chapters: prevThesis.chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section => (
            section.id === id ? { ...section, title: newTitle } : section
          ))
        })),
        backMatter: prevThesis.backMatter.map(section =>
          section.id === id ? { ...section, title: newTitle } : section
        )
      };
    });
  };

  const handleAddChapter = () => {
    if (!thesis) return;

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: 'New Chapter',
      order: thesis.chapters.length + 1,
      sections: []
    };
    setThesis(prevThesis => ({
      ...prevThesis!,
      chapters: [...prevThesis!.chapters, newChapter]
    }));
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    if (!thesis) return;
    
    setThesis(prevThesis => ({
      ...prevThesis!,
      chapters: prevThesis!.chapters.map(chapter =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      )
    }));
  };

  const getAllThesisSections = useCallback(() => {
    if (!thesis) return [];
    const allSections = [
      ...thesis.frontMatter,
      ...thesis.chapters.flatMap(chapter =>
        chapter.sections.map(section => ({
          ...section,
          title: `${chapter.title} - ${section.title}`
        }))
      ),
      ...thesis.backMatter
    ] as Section[];

    return allSections.sort((a, b) => a.order - b.order);
  }, [thesis]);

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

  if (error || (!thesis && currentThesisId)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Error Loading Thesis</h2>
          <p className="text-muted-foreground">{error || "Thesis not found"}</p>
        </div>
      </div>
    );
  }

  if (!thesis && !currentThesisId) {
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

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden animate-fade-in">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ScrollArea className="h-screen">
            <ThesisSidebar
              sections={getAllThesisSections()}
              activeSection={activeSection}
              onSectionSelect={setActiveSection}
            />
          </ScrollArea>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={showPreview ? 50 : 80}>
          <ScrollArea className="h-screen">
            <div className="p-6">
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
            </div>
          </ScrollArea>
        </ResizablePanel>

        {showPreview && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
              <ScrollArea className="h-screen">
                <div ref={previewRef} className="p-6">
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