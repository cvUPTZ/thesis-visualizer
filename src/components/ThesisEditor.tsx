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

  const handleUpdateChapter = async (chapter: Chapter): Promise<void> => {
    console.log('Updating chapter:', chapter);
    if (!thesis) return;
    
    const updatedChapters = thesis.chapters.map(ch => 
      ch.id === chapter.id ? chapter : ch
    );
    
    setThesis({
      ...thesis,
      chapters: updatedChapters
    });
  };

  const handleAddChapter = async (chapter: Chapter): Promise<void> => {
    console.log('Adding chapter:', chapter);
    if (!thesis) return;
    
    setThesis({
      ...thesis,
      chapters: [...thesis.chapters, chapter]
    });
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

  return (
    <div className="flex h-screen overflow-hidden">
      <ThesisSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ThesisEditorHeader 
          thesis={thesis}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <ThesisEditorMain
            thesis={thesis}
            setThesis={setThesis}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onUpdateChapter={handleUpdateChapter}
            onAddChapter={handleAddChapter}
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
                {thesis && <ChatMessages thesisId={thesis.id} />}
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
                {thesis && <ThesisEditorStatus thesis={thesis} />}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};
