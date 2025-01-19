import React from 'react';
import { Section, ThesisSectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
}

// Helper function to determine if a section type can have multiple instances
const canHaveMultipleInstances = (type: ThesisSectionType): boolean => {
  const singleInstanceTypes = [
    'title',
    'abstract',
    'table-of-contents',
    'general-introduction',
    'conclusion'
  ];
  return !singleInstanceTypes.includes(type);
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection
}) => {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAddSection = (type: ThesisSectionType) => {
    console.log('Adding new section of type:', type);
    if (onAddSection) {
      onAddSection(type);
    }
  };

  const renderSectionItem = (section: Section, showAddButton = false) => {
    const isExpanded = expandedSections.includes(section.id);
    const isActive = section.id === activeSection;

    return (
      <div key={section.id} className="space-y-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSection(section.id)}
            className="p-1 hover:bg-accent rounded-sm"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onSectionSelect(section.id)}
            className={cn(
              "flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent",
              isActive && "bg-accent"
            )}
          >
            {section.title}
          </button>
          {showAddButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleAddSection(section.type)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Group sections by type
  const frontMatterSections = sections.filter(s => 
    ['title', 'acknowledgments', 'abstract', 'table-of-contents'].includes(s.type)
  );

  const mainContentSections = [
    { type: 'general-introduction', title: 'General Introduction' },
    { type: 'general-context', title: 'General Context' },
    { type: 'problem-statement', title: 'Problem Statement' },
    { type: 'research-questions', title: 'Research Questions' },
    { type: 'objectives', title: 'Objectives' },
    { type: 'hypotheses', title: 'Hypotheses' },
    { type: 'thesis-structure', title: 'Thesis Structure' },
  ];

  const literatureReviewSections = [
    { type: 'main-theories', title: 'Main Theories' },
    { type: 'key-concepts', title: 'Key Concepts' },
    { type: 'state-of-art', title: 'State of the Art' },
    { type: 'critical-synthesis', title: 'Critical Synthesis' },
  ];

  const methodologySections = [
    { type: 'methodological-approach', title: 'Methodological Approach' },
    { type: 'population-sample', title: 'Population and Sample' },
    { type: 'research-field', title: 'Research Field' },
    { type: 'data-collection', title: 'Data Collection Tools' },
    { type: 'collection-procedures', title: 'Collection Procedures' },
    { type: 'analysis-methods', title: 'Analysis Methods' },
    { type: 'validity-reliability', title: 'Validity and Reliability' },
    { type: 'ethical-considerations', title: 'Ethical Considerations' },
  ];

  const resultsDiscussionSections = [
    { type: 'descriptive-analysis', title: 'Descriptive Analysis' },
    { type: 'statistical-tests', title: 'Statistical Tests' },
    { type: 'hypothesis-testing', title: 'Hypothesis Testing' },
    { type: 'results-summary', title: 'Results Summary' },
    { type: 'results-interpretation', title: 'Results Interpretation' },
    { type: 'literature-comparison', title: 'Literature Comparison' },
    { type: 'theoretical-implications', title: 'Theoretical Implications' },
    { type: 'practical-implications', title: 'Practical Implications' },
    { type: 'study-limitations', title: 'Study Limitations' },
  ];

  const conclusionSections = [
    { type: 'general-summary', title: 'General Summary' },
    { type: 'main-contributions', title: 'Main Contributions' },
    { type: 'overall-limitations', title: 'Overall Limitations' },
    { type: 'future-perspectives', title: 'Future Perspectives' },
    { type: 'recommendations', title: 'Recommendations' },
  ];

  const backMatterSections = sections.filter(s => 
    ['bibliography', 'appendix'].includes(s.type)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-sm px-2">Front Matter</h3>
        {frontMatterSections.map(section => renderSectionItem(section))}
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-sm px-2">Main Content</h3>
        
        <div className="pl-4 space-y-2">
          <h4 className="text-sm text-muted-foreground">Introduction</h4>
          {mainContentSections.map(section => renderSectionItem(section as Section))}
        </div>

        <div className="pl-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-muted-foreground">Part One: Literature Review</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleAddSection('chapter' as ThesisSectionType)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {literatureReviewSections.map(section => renderSectionItem(section as Section))}
        </div>

        <div className="pl-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-muted-foreground">Part Two: Methodology</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleAddSection('chapter' as ThesisSectionType)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {methodologySections.map(section => renderSectionItem(section as Section))}
        </div>

        <div className="pl-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-muted-foreground">Part Three: Results and Discussion</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleAddSection('chapter' as ThesisSectionType)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {resultsDiscussionSections.map(section => renderSectionItem(section as Section))}
        </div>

        <div className="pl-4 space-y-2">
          <h4 className="text-sm text-muted-foreground">Conclusion</h4>
          {conclusionSections.map(section => renderSectionItem(section as Section))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium text-sm px-2">Back Matter</h3>
        {backMatterSections.map(section => renderSectionItem(section))}
      </div>
    </div>
  );
};