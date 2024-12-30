// File: src/components/ThesisEditor.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { ThesisPreview } from './ThesisPreview';
import { ThesisContent } from './thesis/ThesisContent';
import { ThesisToolbar } from './thesis/ThesisToolbar';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ThesisCreationModal } from './thesis/ThesisCreationModal';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThesisListItem {
    id: string;
    title: string;
}

interface ThesisEditorProps {
  thesisId?: string;
}

export const ThesisEditor = ({ thesisId: propsThesisId }: ThesisEditorProps) => {
  const { thesisId: routeThesisId } = useParams();
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
    const [thesisList, setThesisList] = useState<ThesisListItem[]>([]);
    const [open, setOpen] = useState(false);
     const { toast } = useToast();

  // Initialize thesis data
  useEffect(() => {
    const fetchThesis = async () => {
      const currentThesisId = propsThesisId || routeThesisId;
      if (!currentThesisId) {
        setThesis(null);
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('theses')
          .select('*')
          .eq('id', currentThesisId)
          .single();

        if (error) {
          console.error("Error fetching thesis:", error);
          setIsLoading(false);
          return;
        }

        if (data) {
          // Parse the content safely with type assertion
          const parsedContent = typeof data.content === 'string' 
            ? JSON.parse(data.content) 
            : data.content;

          const thesisData: Thesis = {
            id: data.id,
            metadata: {
              description: parsedContent?.metadata?.description || '',
              keywords: parsedContent?.metadata?.keywords || [],
              createdAt: parsedContent?.metadata?.createdAt || new Date().toISOString()
            },
            frontMatter: parsedContent?.frontMatter || [],
            chapters: parsedContent?.chapters || [],
            backMatter: parsedContent?.backMatter || []
          };
          setThesis(thesisData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching thesis:", error);
        setIsLoading(false);
      }
    };

    fetchThesis();
  }, [propsThesisId, routeThesisId]);

  // Initialize hooks at component level, not in useEffect
  useThesisAutosave(thesis);
  useThesisInitialization(thesis);

    const handleThesisCreated = (thesisId: string, title: string) => {
        setThesis(null)
    };


  useEffect(() => {
    if (thesis && thesis.frontMatter.length > 0) {
      setActiveSection(thesis.frontMatter[0].id);
    }
  }, [thesis]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  const fetchTheses = async () => {
      try {
        const { data, error } = await supabase
          .from('theses')
          .select('id, title');

        if (error) {
          console.error('Error fetching theses', error);
           toast({
            title: "Error",
            description: error.message || "Failed to load available theses",
             variant: "destructive",
           });
            return;
        }
         if (data) {
              setThesisList(data as ThesisListItem[])
        }
      } catch (error: any) {
            console.error('Error fetching theses', error);
          toast({
            title: "Error",
            description: "Error fetching available theses",
            variant: "destructive",
          });
      }
    };

  const handleLoadThesis = async (thesisId: string) => {
      navigate(`/thesis/${thesisId}`);
  };

   const handleToggleOpen = useCallback( () => setOpen((prevOpen) => !prevOpen), [setOpen])

    if (!thesis && !propsThesisId && !routeThesisId) {
        return(
           <div className="flex flex-col h-full">
                <div className="flex justify-between p-4 items-center">
                  <ThesisCreationModal onThesisCreated={handleThesisCreated}/>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                         <Button
                           onClick={() => {
                                fetchTheses()
                                handleToggleOpen()
                           }}
                           className="gap-2"
                         >
                            {open ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            Load Thesis
                         </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <ScrollArea className="h-[200px] pr-4">
                            <div className="space-y-2">
                                {thesisList.map((thesis) => (
                                  <Button
                                    variant="ghost"
                                    key={thesis.id}
                                    className="w-full text-left"
                                    onClick={() => handleLoadThesis(thesis.id)}
                                  >
                                    {thesis.title}
                                  </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </PopoverContent>
                 </Popover>
               </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground text-lg">No thesis loaded</p>
              </div>
            </div>
        )
    }


  const handleContentChange = (id: string, newContent: string) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      frontMatter: prevThesis.frontMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      ),
      backMatter: prevThesis.backMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      )
    }));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      frontMatter: prevThesis.frontMatter.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      ),
      backMatter: prevThesis.backMatter.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      )
    }));
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: 'New Chapter',
      order: thesis.chapters.length + 1,
      sections: []
    };
    setThesis(prevThesis => ({
      ...prevThesis,
      chapters: [...prevThesis.chapters, newChapter]
    }));
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      chapters: prevThesis.chapters.map(chapter =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      )
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <ThesisSidebar
        sections={[
          ...thesis.frontMatter,
          ...thesis.chapters.flatMap(chapter =>
            chapter.sections.map(section => ({
              ...section,
              title: `${chapter.title} - ${section.title}`
            }))
          ),
          ...thesis.backMatter
        ]}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
      />
      <main className="flex-1 p-8 flex">
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <ThesisToolbar
              thesisId={thesis.id}
              thesisData={thesis}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview(!showPreview)}
            />
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
        {showPreview && (
          <div className="w-1/2 pl-8 border-l">
            <div ref={previewRef}>
              <ThesisPreview thesis={thesis} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};