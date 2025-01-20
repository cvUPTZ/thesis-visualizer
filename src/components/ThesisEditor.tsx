import React, { useState, useRef } from 'react';
import { Chapter, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
import { ThesisCreationModal } from './thesis/ThesisCreationModal';
import { ThesisList } from './thesis/ThesisList';
import { useThesisData } from '@/hooks/useThesisData';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ThesisEditorHeader } from './thesis/editor/ThesisEditorHeader';
import { ThesisEditorMain } from './thesis/editor/ThesisEditorMain';
import { ThesisEditorStatus } from './thesis/editor/ThesisEditorStatus';
import { useThesisRealtime } from '@/hooks/useThesisRealtime';
import { ChatMessages } from './collaboration/ChatMessages';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ThesisEditorProps {
  thesisId?: string;
}

export const ThesisEditor: React.FC<ThesisEditorProps> = ({ thesisId: propsThesisId }) => {
  const { thesisId: routeThesisId } = useParams();
  const currentThesisId = propsThesisId || routeThesisId;
  const { toast } = useToast();
  
  const { thesis, setThesis, isLoading, error } = useThesisData(currentThesisId);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTracker, setShowTracker] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  useThesisAutosave(thesis);
  useThesisInitialization(thesis);
  useThesisRealtime(currentThesisId, thesis, setThesis);

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    if (!thesis) return;
    
    setThesis(prevThesis => ({
      ...prevThesis!,
      chapters: prevThesis!.chapters.map(chapter =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      )
    }));
  };

  const handleAddChapter = (newChapter: Chapter) => {
    if (!thesis) return;
    
    setThesis(prevThesis => ({
      ...prevThesis!,
      chapters: [...prevThesis!.chapters, newChapter]
    }));
  };

  const calculateProgress = () => {
    if (!thesis) return 0;
    const allSections = [
      ...thesis.frontMatter,
      ...thesis.chapters.flatMap(chapter => chapter.sections),
      ...thesis.backMatter
    ];
    
    const completedSections = allSections.filter(section => 
      section.content && section.content.trim().length > 0
    ).length;
    
    return Math.round((completedSections / allSections.length) * 100);
  };

  const progress = calculateProgress();

  const handleContentChange = (id: string, content: string) => {
    if (!thesis) return;
    
    setThesis(prevThesis => ({
      ...prevThesis!,
      frontMatter: prevThesis!.frontMatter.map(section =>
        section.id === id ? { ...section, content } : section
      ),
      chapters: prevThesis!.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === id ? { ...section, content } : section
        )
      })),
      backMatter: prevThesis!.backMatter.map(section =>
        section.id === id ? { ...section, content } : section
      )
    }));
  };

  const handleTitleChange = (id: string, title: string) => {
    if (!thesis) return;

    setThesis(prevThesis => ({
      ...prevThesis!,
      frontMatter: prevThesis!.frontMatter.map(section =>
        section.id === id ? { ...section, title } : section
      ),
      chapters: prevThesis!.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === id ? { ...section, title } : section
        )
      })),
      backMatter: prevThesis!.backMatter.map(section =>
        section.id === id ? { ...section, title } : section
      )
    }));
  };

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
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between p-4 items-center">
          <ThesisCreationModal onThesisCreated={() => {}} />
          <ThesisList />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground text-lg">No thesis loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ThesisEditorHeader
        thesis={thesis}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />
      
      <div className="px-8 py-4">
        <ThesisEditorStatus
          thesis={thesis}
          thesisId={currentThesisId!}
          progress={progress}
          showTracker={showTracker}
          setShowTracker={setShowTracker}
        />
      </div>

      <ThesisEditorMain
        thesis={thesis}
        activeSection={activeSection}
        showPreview={showPreview}
        previewRef={previewRef}
        onContentChange={handleContentChange}
        onTitleChange={handleTitleChange}
        onUpdateChapter={handleUpdateChapter}
        onAddChapter={handleAddChapter}
      />

      <Collapsible
        open={showChat}
        onOpenChange={setShowChat}
        className="fixed bottom-4 right-4 w-[400px] z-50"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="absolute -top-10 right-0 bg-background shadow-md"
          >
            {showChat ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {currentThesisId && <ChatMessages thesisId={currentThesisId} />}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};