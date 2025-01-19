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

  const renderSectionItem = (section: Section) => {
    const isExpanded = expandedSections.includes(section.id);
    const isActive = section.id === activeSection;
    const showAddButton = canHaveMultipleInstances(section.type);

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
  const mainContentSections = sections.filter(s => 
    ['introduction', 'literature-review', 'methodology', 'results', 'discussion'].includes(s.type)
  );
  const backMatterSections = sections.filter(s => 
    ['conclusion', 'bibliography', 'appendix'].includes(s.type)
  );

  // Add a special section for Chapters
  const chaptersSection = (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-medium text-sm">Chapters</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleAddSection('chapter' as ThesisSectionType)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-sm px-2">Front Matter</h3>
        {frontMatterSections.map(renderSectionItem)}
      </div>
      
      {chaptersSection}
      
      <div className="space-y-2">
        <h3 className="font-medium text-sm px-2">Main Content</h3>
        {mainContentSections.map(renderSectionItem)}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium text-sm px-2">Back Matter</h3>
        {backMatterSections.map(renderSectionItem)}
      </div>
    </div>
  );
};