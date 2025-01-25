import React, { useState, useCallback, useMemo } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { Chapter, Section, Thesis } from '@/types/thesis';
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
  const previewRef = React.useRef<HTMLDivElement>(null);

  useThesisAutosave(thesis);
  useThesisInitialization(thesis);
  const { updateRef } = useThesisRealtime(currentThesisId, setThesis);

  const getAllSections = useMemo(() => {
    if (!thesis?.content) return [];
    
    const sections: Section[] = [];
    
    if (Array.isArray(thesis.content.frontMatter)) {
      sections.push(...thesis.content.frontMatter);
    }
    
    if (thesis.content.generalIntroduction) {
      sections.push(thesis.content.generalIntroduction);
    }
    
    if (Array.isArray(thesis.content.chapters)) {
      thesis.content.chapters.forEach(chapter => {
        if (Array.isArray(chapter.sections)) {
          sections.push(...chapter.sections);
        }
      });
    }
    
    if (thesis.content.generalConclusion) {
      sections.push(thesis.content.generalConclusion);
    }
    
    if (Array.isArray(thesis.content.backMatter)) {
      sections.push(...thesis.content.backMatter);
    }
    
    return sections;
  }, [thesis?.content]);

  const calculateProgress = useMemo(() => {
    const sections = getAllSections;
    if (sections.length === 0) return 0;
    
    const completedSections = sections.filter(section => {
      if (!section?.content) return false;
      if (Array.isArray(section.content)) {
        return section.content.some(item => item.content && item.content.trim().length > 0);
      }
      return typeof section.content === 'string' && section.content.trim().length > 0;
    }).length;
    
    return Math.round((completedSections / sections.length) * 100);
  }, [getAllSections]);

  const handleContentChange = useCallback((id: string, content: string) => {
    if (!thesis) return;
    
    setThesis(prevThesis => {
      if (!prevThesis) return prevThesis;
      const updatedThesis = { ...prevThesis };
      let contentUpdated = false;

      // Update general introduction
      if (updatedThesis.content?.generalIntroduction?.id === id) {
        updatedThesis.content.generalIntroduction = {
          ...updatedThesis.content.generalIntroduction,
          content
        };
        contentUpdated = true;
      }

      // Update general conclusion
      if (!contentUpdated && updatedThesis.content?.generalConclusion?.id === id) {
        updatedThesis.content.generalConclusion = {
          ...updatedThesis.content.generalConclusion,
          content
        };
        contentUpdated = true;
      }

      // Update front matter
      if (!contentUpdated && Array.isArray(updatedThesis.content?.frontMatter)) {
        updatedThesis.content.frontMatter = updatedThesis.content.frontMatter.map(section =>
          section.id === id ? { ...section, content } : section
        );
      }

      // Update chapters
      if (!contentUpdated && Array.isArray(updatedThesis.content?.chapters)) {
        updatedThesis.content.chapters = updatedThesis.content.chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section =>
            section.id === id ? { ...section, content } : section
          )
        }));
      }

      // Update back matter
      if (!contentUpdated && Array.isArray(updatedThesis.content?.backMatter)) {
        updatedThesis.content.backMatter = updatedThesis.content.backMatter.map(section =>
          section.id === id ? { ...section, content } : section
        );
      }

      return updatedThesis;
    });
  }, [thesis, setThesis]);

  const handleTitleChange = useCallback((id: string, title: string) => {
    if (!thesis) return;

    setThesis(prevThesis => {
      if (!prevThesis?.content) return prevThesis;
      const updatedThesis = { ...prevThesis };
      let titleUpdated = false;

      if (Array.isArray(updatedThesis.content.frontMatter)) {
        updatedThesis.content.frontMatter = updatedThesis.content.frontMatter.map(section =>
          section.id === id ? { ...section, title } : section
        );
        if (updatedThesis.content.frontMatter.some(s => s.id === id)) {
          titleUpdated = true;
        }
      }

      if (!titleUpdated && Array.isArray(updatedThesis.content.chapters)) {
        updatedThesis.content.chapters = updatedThesis.content.chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section =>
            section.id === id ? { ...section, title } : section
          )
        }));
      }

      if (!titleUpdated && Array.isArray(updatedThesis.content.backMatter)) {
        updatedThesis.content.backMatter = updatedThesis.content.backMatter.map(section =>
          section.id === id ? { ...section, title } : section
        );
      }

      return updatedThesis;
    });
  }, [thesis]);

  // Show loading state
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

  // Show error state
  if (error || (!thesis && currentThesisId)) {
    console.error('Error loading thesis:', error);
    toast({
      title: "Error Loading Thesis",
      description: error?.message || "Could not load thesis",
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

  // Show empty state
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
    <div className="min-h-screen bg-background flex">
      <ThesisSidebar
        sections={getAllSections}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
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
            progress={calculateProgress}
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
          onUpdateChapter={(chapter: Chapter) => {
            if (!thesis) return;
            setThesis(prev => ({
              ...prev!,
              content: {
                ...prev!.content,
                chapters: prev!.content.chapters.map(c =>
                  c.id === chapter.id ? chapter : c
                )
              }
            }));
          }}
          onAddChapter={(chapter) => {
            if (!thesis) return;
            setThesis(prev => ({
              ...prev!,
              content: {
                ...prev!.content,
                chapters: [...(prev?.content?.chapters || []), chapter]
              }
            }));
          }}
        />
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
};