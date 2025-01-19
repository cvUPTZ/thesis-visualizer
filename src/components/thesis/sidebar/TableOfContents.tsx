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
    activeSection,
    sections: sections?.map(s => ({ id: s.id, title: s.title, type: s.type }))
  });

  // Group sections by their type
  const frontMatterSections = sections?.filter(s => 
    ['title', 'acknowledgments', 'abstract', 'table-of-contents'].includes(s.type)
  ) || [];

  const mainContentSections = sections?.filter(s => 
    !['title', 'acknowledgments', 'abstract', 'table-of-contents', 'bibliography', 'appendix'].includes(s.type)
  ) || [];

  const backMatterSections = sections?.filter(s => 
    ['bibliography', 'appendix'].includes(s.type)
  ) || [];

  const handleSectionSelect = (sectionId: string) => {
    console.log('TableOfContents - Section selected:', sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      console.log('TableOfContents - Found section:', { id: section.id, title: section.title, type: section.type });
      onSectionSelect(sectionId);
    } else {
      console.warn('TableOfContents - Section not found:', sectionId);
    }
  };

  return (
    <div className="space-y-6">
      <FrontMatterSections
        sections={frontMatterSections}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        onAddSection={onAddSection}
      />
      
      <MainContentSections
        sections={mainContentSections}
        chapters={[]}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        onAddSection={onAddSection}
        onAddChapter={onAddChapter}
      />
      
      <BackMatterSections
        sections={backMatterSections}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        onAddSection={onAddSection}
      />
    </div>
  );
};