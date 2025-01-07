import React from 'react';
import { Chapter, Section } from '@/types/thesis';
import { TableOfContents } from './thesis/sidebar/TableOfContents';
import { cn } from '@/lib/utils';

interface ThesisSidebarProps {
    frontMatter: Section[];
    chapters: Chapter[];
    backMatter: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const ThesisSidebar = ({ 
  frontMatter, 
  chapters,
    backMatter,
  activeSection, 
  onSectionSelect 
}: ThesisSidebarProps) => {
    console.log('Rendering ThesisSidebar:', { activeSection });

    const allSections = [
        ...frontMatter,
        ...chapters.flatMap(chapter =>
            chapter.sections.map(section => ({
              ...section,
              chapterTitle: chapter.title // Add chapter title for context
            }))
        ),
        ...backMatter
    ] as Section[];

  
  return (
    <aside className="w-64 h-full bg-editor-bg border-r border-editor-border">
      <div className="sticky top-0 z-10 bg-editor-bg border-b border-editor-border p-4">
        <h2 className="text-lg font-serif font-medium text-editor-text">Contents</h2>
      </div>
      <div className="p-4">
        <TableOfContents
          sections={allSections}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
        />
      </div>
    </aside>
  );
};