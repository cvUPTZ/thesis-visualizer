import React from 'react';
import { Section } from '@/types/thesis';
import { TableOfContents } from './thesis/sidebar/TableOfContents';

interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const ThesisSidebar = ({ sections, activeSection, onSectionSelect }: ThesisSidebarProps) => {
  console.log('Rendering ThesisSidebar:', { sectionsCount: sections.length, activeSection });
  
  return (
    <aside className="h-full bg-editor-bg border-r border-editor-border">
      <div className="mb-6 p-4 border-b border-editor-border">
        <h2 className="text-lg font-serif text-editor-text font-semibold">Contents</h2>
      </div>
      <TableOfContents
        sections={sections}
        activeSection={activeSection}
        onSectionSelect={onSectionSelect}
      />
    </aside>
  );
};