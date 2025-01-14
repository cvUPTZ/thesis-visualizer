import React, { useState } from 'react';
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

export const ThesisEditorMain: React.FC<ThesisEditorMainProps> = ({
  thesis,
  activeSection,
  showPreview,
  previewRef,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter
}) => {
  const { toast } = useToast();
  const [localThesis, setLocalThesis] = useState<Thesis | null>(thesis);

  useThesisRealtime(thesis?.id, localThesis, setLocalThesis);

  const handleUpdateSectionData = (updatedSection: Section) => {
    if (!localThesis) return;
    
    setLocalThesis(prev => {
      if (!prev) return null;

      const frontMatter = prev.frontMatter.map(s => 
        s.id === updatedSection.id ? updatedSection : s
      );
      
      const chapters = prev.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(s => 
          s.id === updatedSection.id ? updatedSection : s
        )
      }));
      
      const backMatter = prev.backMatter.map(s => 
        s.id === updatedSection.id ? updatedSection : s
      );

      return {
        ...prev,
        frontMatter,
        chapters,
        backMatter
      };
    });
  };

  const handleAddSectionTask = (sectionId: string) => {
    if (!localThesis) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      description: 'New Task',
      status: 'pending',
      priority: 'medium'
    };

    setLocalThesis(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        frontMatter: prev.frontMatter.map(s => 
          s.id === sectionId ? { ...s, tasks: [...s.tasks, newTask] } : s
        ),
        chapters: prev.chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(s => 
            s.id === sectionId ? { ...s, tasks: [...s.tasks, newTask] } : s
          )
        })),
        backMatter: prev.backMatter.map(s => 
          s.id === sectionId ? { ...s, tasks: [...s.tasks, newTask] } : s
        )
      };
    });
  };

  const handleContentChange = (id: string, content: string) => {
    if (!localThesis) return;
    setLocalThesis(prev => {
      if (!prev) return null;

      const frontMatter = prev.frontMatter.map(section =>
        section.id === id ? { ...section, content } : section
      );
      const chapters = prev.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === id ? { ...section, content } : section
        )
      }));
      const backMatter = prev.backMatter.map(section =>
        section.id === id ? { ...section, content } : section
      );

      return {
        ...prev,
        frontMatter,
        chapters,
        backMatter
      };
    });
    onContentChange(id, content);
  };

  const handleTitleChange = (id: string, title: string) => {
    if (!localThesis) return;
    setLocalThesis(prev => {
      if (!prev) return null;

      const frontMatter = prev.frontMatter.map(section =>
        section.id === id ? { ...section, title } : section
      );
      const chapters = prev.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === id ? { ...section, title } : section
        )
      }));
      const backMatter = prev.backMatter.map(section =>
        section.id === id ? { ...section, title } : section
      );

      return {
        ...prev,
        frontMatter,
        chapters,
        backMatter
      };
    });
    onTitleChange(id, title);
  };

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <ThesisEditorContent
            frontMatter={localThesis?.frontMatter || []}
            chapters={localThesis?.chapters || []}
            backMatter={localThesis?.backMatter || []}
            activeSection={activeSection}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
            onUpdateSectionData={handleUpdateSectionData}
            onAddSectionTask={handleAddSectionTask}
          />
        </div>
      </div>
      {showPreview && localThesis && (
        <div className="w-1/2 pl-8 border-l">
          <ThesisEditorPreview thesis={localThesis} previewRef={previewRef} />
        </div>
      )}
    </main>
  );
};
