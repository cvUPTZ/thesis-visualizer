import React from 'react';
import { Section } from '@/types/thesis';
import { 
  FileText, BookOpen, List, Book, Database, 
  FileQuestion, ScrollText, Users, Lightbulb, 
  Target, HelpCircle, LayoutList, LineChart, 
  MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';
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

  const introductionSections = sections.filter(s => [
    'general-introduction',
    'general-context',
    'problem-statement',
    'research-questions',
    'objectives',
    'hypotheses',
    'thesis-structure'
  ].includes(s.type));

  const literatureReviewSections = sections.filter(s => [
    'literature-review',
    'theoretical-framework',
    'main-theories',
    'key-concepts',
    'state-of-art',
    'critical-synthesis',
    'conceptual-framework',
    'analysis-model',
    'selected-variables',
    'hypothetical-relationships',
    'reference-framework'
  ].includes(s.type));

  const methodologySections = sections.filter(s => [
    'methodology',
    'research-design',
    'methodological-approach',
    'population-sample',
    'research-field',
    'data-collection',
    'research-protocol',
    'collection-procedures',
    'analysis-methods',
    'validity-reliability',
    'ethical-considerations'
  ].includes(s.type));

  const resultsSections = sections.filter(s => [
    'results',
    'descriptive-analysis',
    'statistical-tests',
    'hypothesis-testing',
    'results-summary',
    'discussion',
    'results-interpretation',
    'literature-comparison',
    'theoretical-implications',
    'practical-implications',
    'study-limitations'
  ].includes(s.type));

  const conclusionSections = sections.filter(s => [
    'conclusion',
    'general-summary',
    'main-contributions',
    'overall-limitations',
    'future-perspectives',
    'recommendations'
  ].includes(s.type));

  const backMatterSections = sections.filter(s => [
    'bibliography',
    'primary-sources',
    'secondary-sources',
    'electronic-sources',
    'appendix',
    'collection-tools',
    'raw-data',
    'detailed-analysis',
    'supporting-documents',
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
      case 'acknowledgments':
        return Users;
      case 'research-questions':
      case 'objectives':
        return Target;
      case 'methodology':
        return ScrollText;
      case 'results':
      case 'discussion':
        return LineChart;
      case 'conclusion':
      case 'recommendations':
        return Lightbulb;
      case 'glossary':
        return HelpCircle;
      case 'detailed-toc':
        return LayoutList;
      case 'general-introduction':
        return MessageSquare;
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
          {sections.length > 0 && (
            <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
          )}
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
          "Introduction",
          <MessageSquare className="h-5 w-5 text-primary" />,
          introductionSections
        )}
        {renderCollapsibleSection(
          "Literature Review",
          <Book className="h-5 w-5 text-primary" />,
          literatureReviewSections
        )}
        {renderCollapsibleSection(
          "Methodology",
          <ScrollText className="h-5 w-5 text-primary" />,
          methodologySections
        )}
        {renderCollapsibleSection(
          "Results & Discussion",
          <LineChart className="h-5 w-5 text-primary" />,
          resultsSections
        )}
        {renderCollapsibleSection(
          "Conclusion",
          <Lightbulb className="h-5 w-5 text-primary" />,
          conclusionSections
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