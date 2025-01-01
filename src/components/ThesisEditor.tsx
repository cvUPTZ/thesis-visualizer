import React, { useState, useRef, useCallback } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { ThesisPreview } from './ThesisPreview';
import { ThesisContent } from './thesis/ThesisContent';
import { ThesisToolbar } from './thesis/ThesisToolbar';
import { ReviewPanel } from './thesis/review/ReviewPanel';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { useParams } from 'react-router-dom';
import { ThesisCreationModal } from './thesis/ThesisCreationModal';
import { ThesisList } from './thesis/ThesisList';
import { useThesisData } from '@/hooks/useThesisData';
import { Skeleton } from './ui/skeleton';
import { useCollaboratorPermissions } from '@/hooks/useCollaboratorPermissions';
import { LoadingScreen } from '@/components/ui/loading-screen';
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
    const { currentUserRole } = useCollaboratorPermissions(currentThesisId || '');
    
  // Initialize hooks
    useThesisAutosave(thesis);
    useThesisInitialization(thesis);

  const handleThesisCreated = (thesisId: string, title: string) => {
      setThesis(prev => {
        if(prev) return prev
        return {
             id: thesisId,
            metadata: {
                 description: "",
                 keywords: [],
                 createdAt: new Date().toISOString()
            },
            frontMatter: [
              {
                  id: crypto.randomUUID(),
                   title,
                content: '',
                   type: 'title',
                  required: true,
                   order: 1,
                  figures: [],
                 tables: [],
                 citations: []
             },
               {
                 id: crypto.randomUUID(),
                   title: 'Abstract',
                 content: '',
                   type: 'abstract',
                   required: true,
                   order: 2,
                  figures: [],
                   tables: [],
                   citations: []
              }
           ],
         chapters: [],
            backMatter: [
                  {
                     id: crypto.randomUUID(),
                   title: 'References',
                     content: '',
                     type: 'references',
                      required: true,
                       order: 1,
                      figures: [],
                      tables: [],
                     citations: [],
                     references: []
                }
             ]
        }
      });
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
                    sections: chapter.sections.map(section => {
                      try {
                        if (section.id === id) {
                         const parsedContent = JSON.parse(newContent)
                            return {...section, ...parsedContent}
                        }
                      } catch (e) {
                        return section.id === id ? { ...section, content: newContent } : section;
                      }
                       return section;
                    })
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
            <LoadingScreen title="Loading Thesis"/>
        );
    }

  if (error || (!thesis && currentThesisId)) {
    return (
       <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Error Loading Thesis</h2>
            <p className="text-muted-foreground">{error || "Thesis not found"}</p>
        </div>
      </div>
    );
  }

  if (!thesis && !currentThesisId) {
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
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : currentUserRole === 'reviewer' ? 'w-2/3' : 'w-full'}`}>
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
              {thesis && <ThesisPreview thesis={thesis} />}
            </div>
          </div>
        )}
        {currentUserRole === 'reviewer' && (
          <div className="w-1/3 border-l">
            <ReviewPanel thesisId={thesis.id} />
          </div>
        )}
      </main>
    </div>
  );
};