import React from 'react';
import { Section } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableOfContents } from './sidebar/TableOfContents';
import { cn } from '@/lib/utils';

export interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  className?: string;
}

export const ThesisSidebar: React.FC<ThesisSidebarProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  className
}) => {
  console.log('Rendering ThesisSidebar with:', { 
    sectionsCount: sections?.length,
    activeSection 
  });

  return (
    <div className={cn(
      "w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <ScrollArea className="h-full py-6">
        <TableOfContents
          sections={sections}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
          isReadOnly={false}
        />
      </ScrollArea>
    </div>
  );
};