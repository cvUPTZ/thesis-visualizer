import React from 'react';
import { useThesisData } from '@/hooks/useThesisData';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';
import { ThesisSidebar } from '@/components/ThesisSidebar';
import { EditorSection } from '@/components/EditorSection';
import { EditorLayout } from '@/components/editor/layout/EditorLayout';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
import { ErrorState } from '@/components/error/ErrorState';
import { useState } from 'react';

interface EditorProps {
  thesisId?: string;
}

export const Editor = ({ thesisId }: EditorProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const { thesis, setThesis, isLoading, error } = useThesisData(thesisId);

  // Initialize thesis if needed
  useThesisInitialization(thesis);

  // Set up autosave
  useThesisAutosave(thesis);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !thesis) {
    return <ErrorState error={error} />;
  }

  const handleContentChange = (id: string, content: string) => {
    if (!thesis) return;

    const updatedThesis = {
      ...thesis,
      frontMatter: thesis.frontMatter.map(section =>
        section.id === id ? { ...section, content } : section
      ),
      chapters: thesis.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === id ? { ...section, content } : section
        ),
      })),
      backMatter: thesis.backMatter.map(section =>
        section.id === id ? { ...section, content } : section
      ),
    };

    setThesis(updatedThesis);
  };

  const handleTitleChange = (id: string, title: string) => {
    if (!thesis) return;

    const updatedThesis = {
      ...thesis,
      frontMatter: thesis.frontMatter.map(section =>
        section.id === id ? { ...section, title } : section
      ),
      chapters: thesis.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(section =>
          section.id === id ? { ...section, title } : section
        ),
      })),
      backMatter: thesis.backMatter.map(section =>
        section.id === id ? { ...section, title } : section
      ),
    };

    setThesis(updatedThesis);
  };

  // Combine all sections for the sidebar
  const allSections = [
    ...thesis.frontMatter,
    ...thesis.chapters.flatMap(chapter => chapter.sections),
    ...thesis.backMatter,
  ];

  // Find the active section
  const currentSection = allSections.find(section => section.id === activeSection);

  return (
    <EditorLayout
      sidebar={
        <ThesisSidebar
          sections={allSections}
          activeSection={activeSection}
          onSectionSelect={setActiveSection}
        />
      }
      content={
        currentSection && (
          <EditorSection
            section={currentSection}
            isActive={true}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
          />
        )
      }
    />
  );
};