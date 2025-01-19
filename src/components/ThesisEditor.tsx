import React, { useState, useRef } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
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

  useThesisAutosave(currentThesisId, thesis);
  useThesisRealtime(currentThesisId);

  const handleUpdateChapter = async (chapter: Chapter): Promise<void> => {
    if (!thesis) return;
    console.log('Updating chapter:', chapter);
    
    const updatedChapters = thesis.chapters.map(ch => 
      ch.id === chapter.id ? chapter : ch
    );
    
    setThesis({
      ...thesis,
      chapters: updatedChapters
    });
  };

  const handleAddChapter = async (chapter: Chapter): Promise<void> => {
    if (!thesis) return;
    console.log('Adding chapter:', chapter);
    
    setThesis({
      ...thesis,
      chapters: [...thesis.chapters, chapter]
    });
  };

  const handleContentChange = (id: string, content: string) => {
    if (!thesis) return;
    
    // Update frontMatter
    const frontMatterIndex = thesis.frontMatter.findIndex(section => section.id === id);
    if (frontMatterIndex !== -1) {
      const updatedFrontMatter = [...thesis.frontMatter];
      updatedFrontMatter[frontMatterIndex] = {
        ...updatedFrontMatter[frontMatterIndex],
        content
      };
      setThesis({ ...thesis, frontMatter: updatedFrontMatter });
      return;
    }

    // Update chapters
    const chapterIndex = thesis.chapters.findIndex(chapter => chapter.id === id);
    if (chapterIndex !== -1) {
      const updatedChapters = [...thesis.chapters];
      updatedChapters[chapterIndex] = {
        ...updatedChapters[chapterIndex],
        content
      };
      setThesis({ ...thesis, chapters: updatedChapters });
      return;
    }

    // Update backMatter
    const backMatterIndex = thesis.backMatter.findIndex(section => section.id === id);
    if (backMatterIndex !== -1) {
      const updatedBackMatter = [...thesis.backMatter];
      updatedBackMatter[backMatterIndex] = {
        ...updatedBackMatter[backMatterIndex],
        content
      };
      setThesis({ ...thesis, backMatter: updatedBackMatter });
    }
  };

  const handleTitleChange = (id: string, title: string) => {
    if (!thesis) return;
    
    // Update frontMatter
    const frontMatterIndex = thesis.frontMatter.findIndex(section => section.id === id);
    if (frontMatterIndex !== -1) {
      const updatedFrontMatter = [...thesis.frontMatter];
      updatedFrontMatter[frontMatterIndex] = {
        ...updatedFrontMatter[frontMatterIndex],
        title
      };
      setThesis({ ...thesis, frontMatter: updatedFrontMatter });
      return;
    }

    // Update chapters
    const chapterIndex = thesis.chapters.findIndex(chapter => chapter.id === id);
    if (chapterIndex !== -1) {
      const updatedChapters = [...thesis.chapters];
      updatedChapters[chapterIndex] = {
        ...updatedChapters[chapterIndex],
        title
      };
      setThesis({ ...thesis, chapters: updatedChapters });
      return;
    }

    // Update backMatter
    const backMatterIndex = thesis.backMatter.findIndex(section => section.id === id);
    if (backMatterIndex !== -1) {
      const updatedBackMatter = [...thesis.backMatter];
      updatedBackMatter[backMatterIndex] = {
        ...updatedBackMatter[backMatterIndex],
        title
      };
      setThesis({ ...thesis, backMatter: updatedBackMatter });
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-screen" />;
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading thesis: {error.message}</p>
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="p-4">
        <p className="text-red-500">No thesis found</p>
      </div>
    );
  }

  const sections: Section[] = [
    ...thesis.frontMatter,
    ...thesis.chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      content: chapter.content || '',
      type: 'chapter',
      order: chapter.order,
      figures: chapter.figures || [],
      tables: chapter.tables || [],
      citations: [],
      references: []
    })),
    ...thesis.backMatter
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <ThesisSidebar 
        sections={sections}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ThesisEditorHeader 
          thesis={thesis}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <ThesisEditorMain
            thesis={thesis}
            activeSection={activeSection}
            onUpdateChapter={handleUpdateChapter}
            onAddChapter={handleAddChapter}
            showPreview={showPreview}
            previewRef={previewRef}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
          />
          
          <div className="w-80 border-l flex flex-col">
            <Collapsible defaultOpen className="border-b">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between p-4">
                  Chat
                  {showChat ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ChatMessages thesisId={thesis.id} />
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between p-4">
                  Progress Tracker
                  {showTracker ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ThesisEditorStatus 
                  thesis={thesis}
                  thesisId={thesis.id}
                  progress={0}
                  showTracker={showTracker}
                  setShowTracker={setShowTracker}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};