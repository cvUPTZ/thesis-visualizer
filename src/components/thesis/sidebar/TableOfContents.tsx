import React from 'react';
import { ChevronDown, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Section } from '@/types/thesis';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const TableOfContents = ({ 
  sections = [], 
  activeSection, 
  onSectionSelect 
}: TableOfContentsProps) => {
  // Group sections by type
  const frontMatterSections = sections.filter(section => 
    ['title', 'abstract', 'acknowledgments'].includes(section.type)
  );
  
  const mainContentSections = sections.filter(section =>
    ['introduction', 'literature-review', 'methodology', 'results', 'discussion', 'conclusion'].includes(section.type)
  );
  
  const backMatterSections = sections.filter(section =>
    ['references', 'appendix'].includes(section.type)
  );

  const [openSections, setOpenSections] = React.useState<string[]>(['frontMatter', 'mainContent', 'backMatter']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  console.log('TableOfContents rendering:', {
    totalSections: sections.length,
    frontMatter: frontMatterSections.length,
    mainContent: mainContentSections.length,
    backMatter: backMatterSections.length,
    activeSection
  });

  const renderSectionItem = (section: Section) => (
    <button
      key={section.id}
      onClick={() => onSectionSelect(section.id)}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md text-sm",
        "hover:bg-editor-hover transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editor-accent",
        "flex items-center gap-2 group",
        activeSection === section.id && "bg-editor-active text-editor-accent font-medium"
      )}
    >
      <FileText className="w-4 h-4 text-editor-text group-hover:text-editor-accent transition-colors" />
      <span className="truncate">{section.title || 'Untitled Section'}</span>
    </button>
  );

  const renderCollapsibleSection = (
    title: string,
    sections: Section[],
    sectionKey: string
  ) => (
    <Collapsible
      key={sectionKey}
      open={openSections.includes(sectionKey)}
      onOpenChange={() => toggleSection(sectionKey)}
      className="space-y-1"
    >
      <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium hover:bg-editor-hover rounded-md">
        {openSections.includes(sectionKey) ? (
          <ChevronDown className="w-4 h-4 mr-2" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-2" />
        )}
        <BookOpen className="w-4 h-4 mr-2" />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {sections.map(renderSectionItem)}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-4">
        {frontMatterSections.length > 0 && (
          renderCollapsibleSection('Front Matter', frontMatterSections, 'frontMatter')
        )}
        {mainContentSections.length > 0 && (
          renderCollapsibleSection('Main Content', mainContentSections, 'mainContent')
        )}
        {backMatterSections.length > 0 && (
          renderCollapsibleSection('Back Matter', backMatterSections, 'backMatter')
        )}
      </div>
    </ScrollArea>
  );
};