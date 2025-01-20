import React from 'react';
import { Section, ThesisSectionType, Chapter } from '@/types/thesis';
import { FrontMatterSections } from './sections/FrontMatterSections';
import { MainContentSections } from './sections/MainContentSections';
import { BackMatterSections } from './sections/BackMatterSections';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
  onAddChapter?: (chapter: Chapter) => void;
  completedSections?: string[];
  onSectionComplete?: (id: string, completed: boolean) => void;
  isReadOnly?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection,
  onAddChapter,
  completedSections = [],
  onSectionComplete,
  isReadOnly = false
}) => {
  console.log('TableOfContents rendering with:', { 
    sectionsCount: sections?.length,
    activeSection,
    isReadOnly
  });

  const frontMatterSections = sections?.filter(s => 
    ['title', 'acknowledgments', 'abstract', 'table-of-contents'].includes(s.type)
  ) || [];

  const mainContentSections = sections?.filter(s => 
    !['title', 'acknowledgments', 'abstract', 'table-of-contents', 'bibliography', 'appendix'].includes(s.type)
  ) || [];

  const backMatterSections = sections?.filter(s => 
    ['bibliography', 'appendix'].includes(s.type)
  ) || [];

  const handleSectionSelect = (id: string) => {
    onSectionSelect(id);
  };

  return (
    <div className="space-y-6">
      <FrontMatterSections
        sections={frontMatterSections}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        onAddSection={!isReadOnly ? onAddSection : undefined}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
        isReadOnly={isReadOnly}
      />
      
      <MainContentSections
        sections={mainContentSections}
        chapters={[]}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        onAddSection={!isReadOnly ? onAddSection : undefined}
        onAddChapter={!isReadOnly ? onAddChapter : undefined}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
        isReadOnly={isReadOnly}
      />
      
      <BackMatterSections
        sections={backMatterSections}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        onAddSection={!isReadOnly ? onAddSection : undefined}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};