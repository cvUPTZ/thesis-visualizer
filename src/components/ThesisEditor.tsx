import React, { useState, useRef } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { Chapter, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
import { ThesisCreationModal } from './thesis/ThesisCreationModal';
import { ThesisList } from './thesis/ThesisList';
import { useThesisData } from '@/hooks/useThesisData';
import { Skeleton } from './ui/skeleton';
import { CollaboratorPresence } from './collaboration/CollaboratorPresence';
import { useToast } from '@/hooks/use-toast';
import { ThesisEditorHeader } from './thesis/editor/ThesisEditorHeader';
import { ThesisEditorContent } from './thesis/editor/ThesisEditorContent';
import { ThesisEditorPreview } from './thesis/editor/ThesisEditorPreview';
import { useThesisRealtime } from '@/hooks/useThesisRealtime';
import { Card } from './ui/card';
import { Users } from 'lucide-react';

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
  const previewRef = useRef<HTMLDivElement>(null);

  useThesisAutosave(thesis);
  useThesisInitialization(thesis);
  useThesisRealtime(currentThesisId, thesis, setThesis);

  console.log('ThesisEditor rendering:', { 
    currentThesisId,
    isLoading,
    hasThesis: !!thesis,
    error: error?.message 
  });

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

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    if (!thesis) return;
    
    setThesis(prevThesis => ({
      ...prevThesis!,
      chapters: prevThesis!.chapters.map(chapter =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
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
    console.log('No thesis loaded, showing creation modal');
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
        sections={[
          ...(thesis?.frontMatter || []),
          ...(thesis?.chapters || []).flatMap(chapter => chapter.sections),
          ...(thesis?.backMatter || [])
        ]}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
      />
      <main className="flex-1 p-8 flex">
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <ThesisEditorHeader
              thesis={thesis}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview(!showPreview)}
            />
            <Card className="p-4 mb-4 bg-white/50 backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="font-medium">Active Collaborators</span>
              </div>
              {currentThesisId && <CollaboratorPresence thesisId={currentThesisId} />}
            </Card>
            <ThesisEditorContent
              frontMatter={thesis?.frontMatter || []}
              chapters={thesis?.chapters || []}
              backMatter={thesis?.backMatter || []}
              activeSection={activeSection}
              onContentChange={handleContentChange}
              onTitleChange={handleTitleChange}
              onUpdateChapter={handleUpdateChapter}
              onAddChapter={(chapter) => {
                setThesis(prev => ({
                  ...prev!,
                  chapters: [...(prev?.chapters || []), chapter]
                }));
              }}
            />
          </div>
        </div>
        {showPreview && thesis && (
          <div className="w-1/2 pl-8 border-l">
            <ThesisEditorPreview thesis={thesis} previewRef={previewRef} />
          </div>
        )}
      </main>
    </div>
  );
};