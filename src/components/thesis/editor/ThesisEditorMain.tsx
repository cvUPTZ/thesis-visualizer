import React, { useState, useCallback, useMemo } from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { ThesisEditorPreview } from './ThesisEditorPreview';
import { Chapter, Section, Task, Thesis } from '@/types/thesis';
import { useThesisRealtime } from '@/hooks/useThesisRealtime';
import { useToast } from '@/hooks/use-toast';

interface ThesisEditorMainProps {
  thesis: Thesis | null;
  activeSection: string;
  showPreview: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
}

export const ThesisEditorMain: React.FC<ThesisEditorMainProps> = React.memo(({
  thesis,
  activeSection,
  showPreview,
  previewRef,
  onContentChange: parentOnContentChange,
  onTitleChange: parentOnTitleChange,
  onUpdateChapter,
  onAddChapter
}) => {
  const { toast } = useToast();
  const [localThesis, setLocalThesis] = useState<Thesis | null>(thesis);

  useThesisRealtime(thesis?.id, localThesis, setLocalThesis);

  // Memoize section update functions
  const updateSections = useCallback((
    prev: Thesis | null,
    sectionId: string,
    updater: (section: Section) => Section
  ): Thesis | null => {
    if (!prev) return null;

    return {
      ...prev,
      frontMatter: prev.frontMatter.map(s => 
        s.id === sectionId ? updater(s) : s
      ),
      chapters: prev.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(s => 
          s.id === sectionId ? updater(s) : s
        )
      })),
      backMatter: prev.backMatter.map(s => 
        s.id === sectionId ? updater(s) : s
      )
    };
  }, []);

  const handleUpdateSectionData = useCallback((updatedSection: Section) => {
    if (!localThesis) return;
    
    setLocalThesis(prev => updateSections(prev, updatedSection.id, () => updatedSection));
  }, [localThesis, updateSections]);

  const handleAddSectionTask = useCallback((sectionId: string) => {
    if (!localThesis) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      description: 'New Task',
      status: 'pending',
      priority: 'medium'
    };

    setLocalThesis(prev => 
      updateSections(prev, sectionId, section => ({
        ...section,
        tasks: [...section.tasks, newTask]
      }))
    );
  }, [localThesis, updateSections]);

  const handleContentChange = useCallback((id: string, content: string) => {
    if (!localThesis) return;
    
    setLocalThesis(prev => 
      updateSections(prev, id, section => ({
        ...section,
        content
      }))
    );
    
    // Debounce the parent update
    requestAnimationFrame(() => {
      parentOnContentChange(id, content);
    });
  }, [localThesis, updateSections, parentOnContentChange]);

  const handleTitleChange = useCallback((id: string, title: string) => {
    if (!localThesis) return;
    
    setLocalThesis(prev => 
      updateSections(prev, id, section => ({
        ...section,
        title
      }))
    );
    
    requestAnimationFrame(() => {
      parentOnTitleChange(id, title);
    });
  }, [localThesis, updateSections, parentOnTitleChange]);

  // Memoize content props
  const contentProps = useMemo(() => ({
    frontMatter: localThesis?.frontMatter || [],
    chapters: localThesis?.chapters || [],
    backMatter: localThesis?.backMatter || [],
    activeSection,
    onContentChange: handleContentChange,
    onTitleChange: handleTitleChange,
    onUpdateChapter,
    onAddChapter,
    onUpdateSectionData: handleUpdateSectionData,
    onAddSectionTask: handleAddSectionTask
  }), [
    localThesis,
    activeSection,
    handleContentChange,
    handleTitleChange,
    onUpdateChapter,
    onAddChapter,
    handleUpdateSectionData,
    handleAddSectionTask
  ]);

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <ThesisEditorContent {...contentProps} />
        </div>
      </div>
      {showPreview && localThesis && (
        <div className="w-1/2 pl-8 border-l">
          <ThesisEditorPreview 
            thesis={localThesis} 
            previewRef={previewRef} 
          />
        </div>
      )}
    </main>
  );
});

// Add display name for debugging
ThesisEditorMain.displayName = 'ThesisEditorMain';