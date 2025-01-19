import React from 'react';
import { Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionTypes } from '@/types/thesis';

interface BackMatterProps {
  sections: Section[];
  onSectionSelect: (id: string) => void;
  activeSection: string;
  onAddSection?: (type: string) => void;
}

export const BackMatterSections: React.FC<BackMatterProps> = ({
  sections,
  onSectionSelect,
  activeSection,
  onAddSection
}) => {
  console.log('Rendering BackMatterSections with:', { sectionsCount: sections.length });

  const backMatterTypes = [
    { type: SectionTypes.bibliography, label: 'Bibliography' },
    { type: SectionTypes['primary-sources'], label: 'Primary Sources' },
    { type: SectionTypes['secondary-sources'], label: 'Secondary Sources' },
    { type: SectionTypes['electronic-sources'], label: 'Electronic Sources' },
    { type: SectionTypes.appendix, label: 'Appendix' },
    { type: SectionTypes['collection-tools'], label: 'Collection Tools' },
    { type: SectionTypes['raw-data'], label: 'Raw Data' },
    { type: SectionTypes['detailed-analysis'], label: 'Detailed Analysis' },
    { type: SectionTypes['supporting-documents'], label: 'Supporting Documents' },
    { type: SectionTypes['reference-tables'], label: 'Reference Tables' },
    { type: SectionTypes.index, label: 'Index' },
    { type: SectionTypes.glossary, label: 'Glossary' }
  ];

  const backMatterSections = sections.filter(s => 
    backMatterTypes.some(type => type.type === s.type)
  );

  const renderAddButton = (type: string, label: string) => {
    if (sections.some(s => s.type === type)) return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => onAddSection?.(type)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add {label}
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="px-2">
        <h3 className="text-sm font-semibold mb-4">Back Matter</h3>
        
        {/* References Section */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-muted-foreground">References</h4>
          <div className="space-y-1">
            {renderAddButton(SectionTypes.bibliography, 'Bibliography')}
            {renderAddButton(SectionTypes['primary-sources'], 'Primary Sources')}
            {renderAddButton(SectionTypes['secondary-sources'], 'Secondary Sources')}
            {renderAddButton(SectionTypes['electronic-sources'], 'Electronic Sources')}
          </div>
        </div>

        {/* Appendices Section */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-muted-foreground">Appendices</h4>
          <div className="space-y-1">
            {renderAddButton(SectionTypes.appendix, 'Appendix')}
            {renderAddButton(SectionTypes['collection-tools'], 'Collection Tools')}
            {renderAddButton(SectionTypes['raw-data'], 'Raw Data')}
            {renderAddButton(SectionTypes['detailed-analysis'], 'Detailed Analysis')}
          </div>
        </div>

        {/* Additional Materials */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Additional Materials</h4>
          <div className="space-y-1">
            {renderAddButton(SectionTypes['supporting-documents'], 'Supporting Documents')}
            {renderAddButton(SectionTypes['reference-tables'], 'Reference Tables')}
            {renderAddButton(SectionTypes.index, 'Index')}
            {renderAddButton(SectionTypes.glossary, 'Glossary')}
          </div>
        </div>

        {/* Existing Sections */}
        <div className="mt-4 space-y-1">
          {backMatterSections.map(section => (
            <button
              key={section.id}
              onClick={() => onSectionSelect(section.id)}
              className={cn(
                "flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                activeSection === section.id && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
