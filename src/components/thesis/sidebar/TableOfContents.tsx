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
  completedSections: string[];
  onSectionComplete: (id: string, completed: boolean) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection,
  onAddChapter,
  completedSections,
  onSectionComplete
}) => {
  console.log('TableOfContents rendering with:', { 
    sectionsCount: sections?.length,
    activeSection,
    sections: sections?.map(s => ({ id: s.id, title: s.title, type: s.type }))
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
        onAddSection={onAddSection}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
      />
      
      <MainContentSections
        sections={mainContentSections}
        chapters={[]}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={onAddSection}
        onAddChapter={onAddChapter}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
      />
      
      <BackMatterSections
        sections={backMatterSections}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={onAddSection}
        completedSections={completedSections}
        onSectionComplete={onSectionComplete}
      />
    </div>
  );
};