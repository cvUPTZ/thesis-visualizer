import React from 'react';
import { Section } from '@/types/thesis';
import { TableOfContents } from './thesis/sidebar/TableOfContents';
import { cn } from '@/lib/utils';

interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const ThesisSidebar = ({ sections, activeSection, onSectionSelect }: ThesisSidebarProps) => {
  console.log('Rendering ThesisSidebar:', { sectionsCount: sections.length, activeSection });
  
  return (
    <aside className="w-64 h-full bg-editor-bg border-r border-editor-border">
      <div className="sticky top-0 z-10 bg-editor-bg border-b border-editor-border p-4">
        <h2 className="text-lg font-serif font-medium text-editor-text">Contents</h2>
      </div>
      <div className="p-4">
        <TableOfContents
          sections={sections}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
        />
      </div>
    </aside>
  );
};