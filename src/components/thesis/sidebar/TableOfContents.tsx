import React from 'react';
import { Section } from '@/types/thesis';
import { FileText, BookOpen, List, Table, Book, Database, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections = [],
  activeSection,
  onSectionSelect
}) => {
  console.log('Rendering TableOfContents:', {
    sectionsCount: sections?.length,
    activeSection
  });

  const frontMatterSections = sections.filter(s => [
    'title',
    'acknowledgments',
    'abstract',
    'table-of-contents',
    'list-of-figures',
    'list-of-tables',
    'list-of-abbreviations'
  ].includes(s.type));

  const mainContentSections = sections.filter(s => [
    'general-introduction',
    'problem-statement',
    'research-questions',
    'objectives',
    'hypotheses',
    'thesis-structure',
    'literature-review',
    'theoretical-framework',
    'conceptual-framework',
    'methodology',
    'research-design',
    'research-protocol',
    'results',
    'discussion',
    'conclusion'
  ].includes(s.type));

  const backMatterSections = sections.filter(s => [
    'bibliography',
    'appendix',
    'reference-tables',
    'index',
    'glossary',
    'detailed-toc'
  ].includes(s.type));

  const getIconForSection = (type: string) => {
    switch (type) {
      case 'table-of-contents':
      case 'list-of-figures':
      case 'list-of-tables':
        return List;
      case 'bibliography':
      case 'reference-tables':
        return Database;
      case 'theoretical-framework':
      case 'conceptual-framework':
        return Book;
      case 'appendix':
        return FileQuestion;
      default:
        return FileText;
    }
  };

  const renderSectionItem = (section: Section) => {
    const Icon = getIconForSection(section.type);
    const isActive = activeSection === section.id;

    return (
      <Button
        key={section.id}
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 text-sm",
          isActive && "bg-primary/10 text-primary"
        )}
        onClick={() => onSectionSelect(section.id)}
      >
        <Icon className="h-4 w-4" />
        <span className="truncate">{section.title}</span>
      </Button>
    );
  };

  const renderCollapsibleSection = (title: string, icon: React.ReactNode, sections: Section[]) => {
    if (sections.length === 0) return null;

    return (
      <Collapsible defaultOpen className="space-y-2">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 space-y-1">
          {sections.map(renderSectionItem)}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-6 p-4">
        {renderCollapsibleSection(
          "Front Matter",
          <BookOpen className="h-5 w-5 text-primary" />,
          frontMatterSections
        )}
        {renderCollapsibleSection(
          "Main Content",
          <Book className="h-5 w-5 text-primary" />,
          mainContentSections
        )}
        {renderCollapsibleSection(
          "Back Matter",
          <FileText className="h-5 w-5 text-primary" />,
          backMatterSections
        )}
      </div>
    </ScrollArea>
  );
};