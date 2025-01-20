import React from 'react';
import { Section, ThesisSectionType, Chapter } from '@/types/thesis';
import { FrontMatterSections } from './sections/FrontMatterSections';
import { MainContentSections } from './sections/MainContentSections';
import { BackMatterSections } from './sections/BackMatterSections';

interface TableOfContentsProps {
  sections: Section[];
  chapters?: Chapter[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onChapterSelect?: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
  onAddChapter?: (chapter: Chapter) => void;
  completedSections?: string[];
  onSectionComplete?: (id: string, completed: boolean) => void;
  isReadOnly?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  chapters = [],
  activeSection,
  onSectionSelect,
  onChapterSelect,
  onAddSection,
  onAddChapter,
  completedSections = [],
  onSectionComplete,
  isReadOnly = false
}) => {
  console.log('TableOfContents rendering with:', { 
    sectionsCount: sections?.length,
    chaptersCount: chapters?.length,
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

  return (
    <div className="space-y-6">
      <FrontMatterSections
        sections={frontMatterSections}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={!isReadOnly ? onAddSection : undefined}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
        isReadOnly={isReadOnly}
      />
      
      <MainContentSections
        sections={mainContentSections}
        chapters={chapters}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onChapterSelect={onChapterSelect}
        onAddSection={!isReadOnly ? onAddSection : undefined}
        onAddChapter={!isReadOnly ? onAddChapter : undefined}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
        isReadOnly={isReadOnly}
      />
      
      <BackMatterSections
        sections={backMatterSections}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={!isReadOnly ? onAddSection : undefined}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};