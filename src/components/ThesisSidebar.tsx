import React from 'react';
import { Section, ThesisSectionType } from '@/types/thesis';
import { TableOfContents } from './thesis/sidebar/TableOfContents';
import { cn } from '@/lib/utils';

interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
}

export const ThesisSidebar = ({ 
  sections = [], 
  activeSection, 
  onSectionSelect,
  onAddSection 
}: ThesisSidebarProps) => {
  console.log('Rendering ThesisSidebar:', { 
    activeSection, 
    sectionsCount: sections?.length,
    sections: sections?.map(s => ({ id: s.id, title: s.title }))
  });
  
  const validSections = Array.isArray(sections) ? sections.filter(section => 
    section && typeof section === 'object' && 'id' in section && 'title' in section
  ) : [];
  
  return (
    <aside className="w-64 h-full bg-editor-bg border-r border-editor-border">
      <div className="sticky top-0 z-10 bg-editor-bg border-b border-editor-border p-4">
        <h2 className="text-lg font-serif font-medium text-editor-text">Contents</h2>
      </div>
      <div className="p-4">
        <TableOfContents
          sections={validSections}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
          onAddSection={onAddSection}
        />
      </div>
    </aside>
  );
};