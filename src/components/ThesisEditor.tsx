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
import { EditorLayout } from './editor/layout/EditorLayout';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from './ui/progress';
import { supabase } from '@/integrations/supabase/client';

const LoadingProgress = () => {
  const { data: progress = 0 } = useQuery({
    queryKey: ['loadingProgress'],
    queryFn: async () => {
      // Simulate progress calculation
      return Math.min(90, Math.random() * 100);
    },
    refetchInterval: 800,
    enabled: true
  });

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <Progress value={progress} className="w-full h-2" />
      <p className="text-sm text-muted-foreground text-center animate-pulse">
        Loading thesis editor...
      </p>
    </div>
  );
};

const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-background"
  >
    <div className="container mx-auto p-8 space-y-8">
      <LoadingProgress />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg p-6 shadow-lg animate-pulse"
          >
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export const ThesisEditor = () => {
  const { thesisId } = useParams();
  const { thesis, setThesis, isLoading, error } = useThesisData(thesisId);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useThesisAutosave(thesis);
  useThesisInitialization(thesis);

  const { data: thesisMetadata } = useQuery({
    queryKey: ['thesisMetadata', thesisId],
    queryFn: async () => {
      if (!thesisId) return null;
      const { data, error } = await supabase
        .from('theses')
        .select('title, created_at, updated_at')
        .eq('id', thesisId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!thesisId
  });

  const handleThesisCreated = useCallback((thesisId: string, title: string) => {
    console.log("Thesis created:", { thesisId, title });
    setThesis(null);
  }, [setThesis]);

  const handleContentChange = useCallback((id: string, newContent: string) => {
    if (!thesis) return;
    
    setThesis(prevThesis => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        frontMatter: prevThesis.frontMatter.map(section =>
          section.id === id ? { ...section, content: newContent } : section
        ),
        chapters: prevThesis.chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section =>
            section.id === id ? { ...section, content: newContent } : section
          )
        })),
        backMatter: prevThesis.backMatter.map(section =>
          section.id === id ? { ...section, content: newContent } : section
        )
      };
    });
  }, [thesis]);

  const getAllThesisSections = () => {
    if (!thesis) return [];
    return [
      ...thesis.frontMatter,
      ...thesis.chapters.flatMap(chapter => chapter.sections),
      ...thesis.backMatter
    ];
  };

  const handleTitleChange = (chapterId: string, newTitle: string) => {
    if (!thesis) return;
    
    setThesis(prevThesis => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        chapters: prevThesis.chapters.map(chapter =>
          chapter.id === chapterId ? { ...chapter, title: newTitle } : chapter
        )
      };
    });
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    if (!thesis) return;
    
    setThesis(prevThesis => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        chapters: prevThesis.chapters.map(chapter =>
          chapter.id === updatedChapter.id ? updatedChapter : chapter
        )
      };
    });
  };

  const handleAddChapter = () => {
    if (!thesis) return;
    
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: 'New Chapter',
      order: thesis.chapters.length + 1,
      sections: []
    };
    
    setThesis(prevThesis => {
      if (!prevThesis) return thesis;
      return {
        ...prevThesis,
        chapters: [...prevThesis.chapters, newChapter]
      };
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || (!thesis && thesisId)) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Error Loading Thesis</h2>
          <p className="text-muted-foreground">{error || "Thesis not found"}</p>
        </div>
      </motion.div>
    );
  }

  if (!thesis && !thesisId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-screen"
      >
        <div className="flex justify-between p-4 items-center border-b">
          <ThesisCreationModal onThesisCreated={handleThesisCreated} />
          <ThesisList />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">No thesis loaded</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <EditorLayout
          sidebar={
            <ThesisSidebar
              sections={getAllThesisSections()}
              activeSection={activeSection}
              onSectionSelect={setActiveSection}
            />
          }
          content={
            <>
              <ThesisToolbar
                thesisId={thesis.id}
                thesisData={thesis}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
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
              </motion.div>
            </>
          }
          preview={showPreview ? <ThesisPreview thesis={thesis} /> : undefined}
          showPreview={showPreview}
        />
      </motion.div>
    </AnimatePresence>
  );
};
