import React, { useState } from 'react';
import { Section, Chapter, ThesisSectionType } from '@/types/thesis';
import { ScrollArea } from './ui/scroll-area';
import { TableOfContents } from './thesis/sidebar/TableOfContents';
import { Checkbox } from './ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
  onAddChapter?: (chapter: Chapter) => void;
}

export const ThesisSidebar: React.FC<ThesisSidebarProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection,
  onAddChapter
}) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { toast } = useToast();

  console.log('Rendering ThesisSidebar with:', { 
    sectionsCount: sections?.length,
    activeSection,
    sections: sections?.map(s => ({ id: s.id, title: s.title, type: s.type }))
  });

  const handleSectionSelect = (sectionId: string) => {
    console.log('Section selected:', sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      console.log('Found section:', { id: section.id, title: section.title, type: section.type });
      onSectionSelect(sectionId);
    } else {
      console.warn('Section not found:', sectionId);
    }
  };

  const handleSectionComplete = (sectionId: string, completed: boolean) => {
    setCompletedSections(prev => {
      const newCompleted = completed 
        ? [...prev, sectionId]
        : prev.filter(id => id !== sectionId);
      
      const progress = Math.round((newCompleted.length / sections.length) * 100);
      
      toast({
        title: completed ? "Section marked as complete" : "Section marked as incomplete",
        description: `Overall progress: ${progress}%`,
      });
      
      return newCompleted;
    });
  };

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full py-6">
        <TableOfContents
          sections={sections}
          activeSection={activeSection}
          onSectionSelect={handleSectionSelect}
          onAddSection={onAddSection}
          onAddChapter={onAddChapter}
          completedSections={completedSections}
          onSectionComplete={handleSectionComplete}
        />
      </ScrollArea>
    </div>
  );
};
