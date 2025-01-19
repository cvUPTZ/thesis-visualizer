import React from 'react';
import { ChevronDown, ChevronRight, BookOpen, Image, Table } from 'lucide-react';
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
  const [openSections, setOpenSections] = React.useState<string[]>(['frontMatter', 'mainContent', 'backMatter', 'figures', 'tables']);

  // Group sections by type
  const frontMatterSections = sections.filter(section => 
    ['title', 'abstract', 'acknowledgments'].includes(section.type || '')
  );
  
  const defaultSections: Section[] = [
    { 
      id: 'introduction', 
      title: 'Introduction', 
      type: 'introduction',
      content: '',
      order: 1,
      figures: [],
      tables: [],
      citations: [],
      references: []
    },
    { 
      id: 'literature-review', 
      title: 'Literature Review', 
      type: 'literature-review',
      content: '',
      order: 2,
      figures: [],
      tables: [],
      citations: [],
      references: []
    },
    { 
      id: 'methodology', 
      title: 'Methodology', 
      type: 'methodology',
      content: '',
      order: 3,
      figures: [],
      tables: [],
      citations: [],
      references: []
    },
    { 
      id: 'results', 
      title: 'Results', 
      type: 'results',
      content: '',
      order: 4,
      figures: [],
      tables: [],
      citations: [],
      references: []
    },
    { 
      id: 'discussion', 
      title: 'Discussion', 
      type: 'discussion',
      content: '',
      order: 5,
      figures: [],
      tables: [],
      citations: [],
      references: []
    },
    { 
      id: 'conclusion', 
      title: 'Conclusion', 
      type: 'conclusion',
      content: '',
      order: 6,
      figures: [],
      tables: [],
      citations: [],
      references: []
    }
  ];

  const mainContentSections = [
    ...defaultSections,
    ...sections.filter(section =>
      !['title', 'abstract', 'acknowledgments', 'references', 'appendix'].includes(section.type || '')
    )
  ];
  
  const backMatterSections = sections.filter(section =>
    ['references', 'appendix'].includes(section.type || '')
  );

  const allFigures = sections.flatMap(section => 
    section.figures?.map(figure => ({
      id: figure.id,
      title: `Figure ${figure.number}: ${figure.caption}`,
      parentSection: section.title
    })) || []
  );

  const allTables = sections.flatMap(section => 
    section.tables?.map(table => ({
      id: table.id,
      title: table.title || 'Untitled Table',
      parentSection: section.title
    })) || []
  );

  console.log('TableOfContents sections:', {
    total: sections.length,
    frontMatter: frontMatterSections.length,
    mainContent: mainContentSections.length,
    backMatter: backMatterSections.length,
    figures: allFigures.length,
    tables: allTables.length,
    active: activeSection
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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
    sectionsList: Section[],
    sectionKey: string,
    icon: React.ReactNode
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
        {icon}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {sectionsList.map(renderSectionItem)}
      </CollapsibleContent>
    </Collapsible>
  );

  const renderElementsList = (
    title: string,
    elements: Array<{ id: string; title: string; parentSection: string }>,
    sectionKey: string,
    icon: React.ReactNode
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
        {icon}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {elements.map(element => (
          <button
            key={element.id}
            onClick={() => onSectionSelect(element.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm",
              "hover:bg-editor-hover transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editor-accent",
              "flex flex-col gap-1",
              activeSection === element.id && "bg-editor-active text-editor-accent font-medium"
            )}
          >
            <span className="truncate font-medium">{element.title}</span>
            <span className="text-xs text-editor-text-light truncate">
              {element.parentSection}
            </span>
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {frontMatterSections.length > 0 && (
          renderCollapsibleSection(
            'Front Matter',
            frontMatterSections,
            'frontMatter',
            <BookOpen className="w-4 h-4 mr-2" />
          )
        )}
        {mainContentSections.length > 0 && (
          renderCollapsibleSection(
            'Main Content',
            mainContentSections,
            'mainContent',
            <BookOpen className="w-4 h-4 mr-2" />
          )
        )}
        {backMatterSections.length > 0 && (
          renderCollapsibleSection(
            'Back Matter',
            backMatterSections,
            'backMatter',
            <BookOpen className="w-4 h-4 mr-2" />
          )
        )}
        {allFigures.length > 0 && (
          renderElementsList(
            'Figures',
            allFigures,
            'figures',
            <Image className="w-4 h-4 mr-2" />
          )
        )}
        {allTables.length > 0 && (
          renderElementsList(
            'Tables',
            allTables,
            'tables',
            <Table className="w-4 h-4 mr-2" />
          )
        )}
      </div>
    </ScrollArea>
  );
};
