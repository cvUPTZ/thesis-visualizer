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
import { CollaboratorPresence } from './collaboration/CollaboratorPresence';
import { NotificationCenter } from './collaboration/NotificationCenter';
import { useToast } from '@/hooks/use-toast';

interface ThesisEditorProps {
  thesisId?: string;
}

export const ThesisEditor = ({ thesisId: propsThesisId }: ThesisEditorProps) => {
  const { thesisId: routeThesisId } = useParams();
  const currentThesisId = propsThesisId || routeThesisId;
  const { toast } = useToast();
  
  const { thesis, setThesis, isLoading, error } = useThesisData(currentThesisId);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useThesisAutosave(thesis);
  useThesisInitialization(thesis);

  console.log('ThesisEditor rendering:', { 
    currentThesisId,
    isLoading,
    hasThesis: !!thesis,
    error: error?.message 
  });

  const handleThesisCreated = (thesisId: string, title: string) => {
    console.log('Creating new thesis:', { thesisId, title });
    const newThesis: Thesis = {
      id: thesisId,
      title: title,
      content: {},
      metadata: {
        description: '',
        keywords: [],
        createdAt: new Date().toISOString(),
        universityName: '',
        departmentName: '',
        authorName: '',
        thesisDate: '',
        committeeMembers: []
      },
      frontMatter: [],
      chapters: [],
      backMatter: [],
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setThesis(newThesis);
  };

  const handleContentChange = (id: string, newContent: string) => {
    if (!thesis) return;
    
    setThesis(prevThesis => ({
      ...prevThesis!,
      frontMatter: prevThesis!.frontMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      ),
      chapters: prevThesis!.chapters.map(chapter => ({
            ...chapter,
            sections: chapter.sections.map(section => (
                section.id === id ? { ...section, content: newContent } : section
            ))
        })),
      backMatter: prevThesis!.backMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      )
    }));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
      if (!thesis) return;

      setThesis(prevThesis => ({
          ...prevThesis!,
          frontMatter: prevThesis!.frontMatter.map(section =>
              section.id === id ? { ...section, title: newTitle } : section
          ),
        chapters: prevThesis!.chapters.map(chapter => ({
              ...chapter,
              sections: chapter.sections.map(section => (
                  section.id === id ? { ...section, title: newTitle } : section
              ))
          })),
          backMatter: prevThesis!.backMatter.map(section =>
              section.id === id ? { ...section, title: newTitle } : section
          )
      }));
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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || (!thesis && currentThesisId)) {
    console.error('Error loading thesis:', error);
    toast({
      title: "Error Loading Thesis",
      description: error?.message || "Could not load thesis. Please try again.",
      variant: "destructive",
    });
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Error Loading Thesis</h2>
          <p className="text-muted-foreground">{error?.message || "Thesis not found"}</p>
        </div>
      </div>
    );
  }

  if (!thesis && !currentThesisId) {
    console.log('No thesis loaded, showing creation modal');
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between p-4 items-center">
          <ThesisCreationModal onThesisCreated={handleThesisCreated} />
          <ThesisList />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground text-lg">No thesis loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <ThesisSidebar
        sections={getAllThesisSections()}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
      />
      <main className="flex-1 p-8 flex">
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <ThesisToolbar
                thesisId={thesis?.id || ''}
                thesisData={thesis!}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />
              <NotificationCenter />
            </div>
            <ThesisContent
              frontMatter={thesis?.frontMatter || []}
              chapters={thesis?.chapters || []}
              backMatter={thesis?.backMatter || []}
              activeSection={activeSection}
              onContentChange={handleContentChange}
              onTitleChange={handleTitleChange}
              onUpdateChapter={handleUpdateChapter}
              onAddChapter={handleAddChapter}
            />
          </div>
        </div>
        {showPreview && thesis && (
          <div className="w-1/2 pl-8 border-l">
            <div ref={previewRef}>
              <ThesisPreview thesis={thesis} />
            </div>
          </div>
        )}
      </main>
      {currentThesisId && <CollaboratorPresence thesisId={currentThesisId} />}
    </div>
  );
};