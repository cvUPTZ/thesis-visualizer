import React, { useState, useRef } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { Section, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
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

export const ThesisEditor = React.memo(({ thesisId: propsThesisId }: ThesisEditorProps) => {
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

  const handleUpdateSectionData = (updatedSection: Section) => {
    if (!thesis) return;

    setThesis(prevThesis => {
      if (!prevThesis) return prevThesis;

      // Check if section already exists
      const existingFrontMatter = prevThesis.frontMatter.find(s => s.id === updatedSection.id);
      const existingBackMatter = prevThesis.backMatter.find(s => s.id === updatedSection.id);

      if (existingFrontMatter) {
        // Update in frontMatter
        return {
          ...prevThesis,
          frontMatter: prevThesis.frontMatter.map(s =>
            s.id === updatedSection.id ? updatedSection : s
          )
        };
      } else if (existingBackMatter) {
        // Update in backMatter
        return {
          ...prevThesis,
          backMatter: prevThesis.backMatter.map(s =>
            s.id === updatedSection.id ? updatedSection : s
          )
        };
      } else {
        // Add as new section to mainContent
        return {
          ...prevThesis,
          frontMatter: [...prevThesis.frontMatter, updatedSection]
        };
      }
    });
  };

  const handleContentChange = (id: string, content: string) => {
    console.log('handleContentChange fired', {id, content});
    if (!thesis) return;

    setThesis(prevThesis => {
      if (!prevThesis) return prevThesis;
      return {
        ...prevThesis,
        frontMatter: (prevThesis.frontMatter || []).map(section =>
          section.id === id ? { ...section, content } : section
        ),
        chapters: (prevThesis.chapters || []).map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section =>
            section.id === id ? { ...section, content } : section
          )
        })),
        backMatter: (prevThesis.backMatter || []).map(section =>
          section.id === id ? { ...section, content } : section
        )
      };
    });
  };

  const handleTitleChange = (id: string, title: string) => {
    console.log('handleTitleChange fired', { id, title });
    if (!thesis) return;

    setThesis(prevThesis => {
      if (!prevThesis) return prevThesis;
      return {
        ...prevThesis,
        frontMatter: (prevThesis.frontMatter || []).map(section =>
          section.id === id ? { ...section, title } : section
        ),
        chapters: (prevThesis.chapters || []).map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section =>
            section.id === id ? { ...section, title } : section
          )
        })),
        backMatter: (prevThesis.backMatter || []).map(section =>
          section.id === id ? { ...section, title } : section
        )
      };
    });
  };

  const handleAddSectionTask = (sectionId: string) => {
    if (!thesis) return;
    // Implementation for adding tasks
  };

  const handleUpdateSectionTask = (sectionId: string, taskId: string, status: 'pending' | 'in progress' | 'completed' | 'on hold') => {
    if (!thesis) return;
    // Implementation for updating tasks
  };

  const handleChangeSectionTaskDescription = (sectionId: string, taskId: string, description: string) => {
    if (!thesis) return;
    // Implementation for changing task descriptions
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

  return (
    <div className="min-h-screen bg-background flex">
      <ThesisSidebar
        sections={[
          ...(thesis?.frontMatter || []),
          ...(thesis?.backMatter || [])
        ]}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
        thesisId={currentThesisId!}
        onUpdateSectionData={handleUpdateSectionData}
        onAddSectionTask={handleAddSectionTask}
        onUpdateSectionTask={handleUpdateSectionTask}
        onChangeSectionTaskDescription={handleChangeSectionTaskDescription}
      />

      <div className="flex-1 flex flex-col">
        <ThesisEditorHeader
          thesis={thesis}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />
        
        <div className="px-8 py-4">
          <ThesisEditorStatus
            thesis={thesis}
            thesisId={currentThesisId!}
            progress={0} // Placeholder for progress calculation
            showTracker={showTracker}
            setShowTracker={setShowTracker}
          />
        </div>

        <div className="px-8 py-4">
          <ThesisEditorMain
            thesis={thesis}
            activeSection={activeSection}
            showPreview={showPreview}
            previewRef={previewRef}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            onUpdateChapter={() => {}} // Placeholder for chapter update
            onAddChapter={() => {}} // Placeholder for chapter addition
          />
        </div>
      </div>

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
});

ThesisEditor.displayName = 'ThesisEditor';
