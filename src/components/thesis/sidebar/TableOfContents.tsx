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
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection,
  onAddChapter
}) => {
  console.log('TableOfContents rendering with:', { 
    sectionsCount: sections?.length,
    activeSection 
  });

  return (
    <div className="space-y-6">
      <FrontMatterSections
        sections={sections}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={onAddSection}
      />
      
      <MainContentSections
        sections={sections}
        chapters={[]}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={onAddSection}
        onAddChapter={onAddChapter}
      />
      
      <BackMatterSections
        sections={sections}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={onAddSection}
      />
    </div>
  );
};