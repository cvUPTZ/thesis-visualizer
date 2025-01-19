import React from 'react';
import { Section, ThesisSectionType } from '@/types/thesis';
import { FrontMatterSections } from './sections/FrontMatterSections';
import { MainContentSections } from './sections/MainContentSections';
import { BackMatterSections } from './sections/BackMatterSections';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection
}) => {
  console.log('TableOfContents rendering with:', { 
    sectionsCount: sections?.length,
    activeSection 
  });

  const handleAddChapter = () => {
    if (onAddSection) {
      onAddSection('chapter' as ThesisSectionType);
    }
  };

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
        chapters={[]} // This will be populated from the thesis data
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
        onAddSection={onAddSection}
        onAddChapter={handleAddChapter}
      />
      
      <BackMatterSections
        sections={sections}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
      />
    </div>
  );
};