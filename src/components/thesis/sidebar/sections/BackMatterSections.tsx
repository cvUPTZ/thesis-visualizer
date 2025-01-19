import React from 'react';
import { Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, FileText, Link2, FileBox, ClipboardList, Database, LineChart, Files, Table2, BookMarked, BookKey } from 'lucide-react';
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
  const backMatterGroups = [
    {
      title: "References",
      types: [
        { type: SectionTypes.bibliography, label: 'Bibliography', icon: BookOpen },
        { type: SectionTypes['primary-sources'], label: 'Primary Sources', icon: FileText },
        { type: SectionTypes['secondary-sources'], label: 'Secondary Sources', icon: Link2 },
        { type: SectionTypes['electronic-sources'], label: 'Electronic Sources', icon: FileBox }
      ]
    },
    {
      title: "Appendices",
      types: [
        { type: SectionTypes.appendix, label: 'Appendix', icon: ClipboardList },
        { type: SectionTypes['collection-tools'], label: 'Collection Tools', icon: Database },
        { type: SectionTypes['raw-data'], label: 'Raw Data', icon: LineChart },
        { type: SectionTypes['detailed-analysis'], label: 'Detailed Analysis', icon: Files }
      ]
    },
    {
      title: "Additional Materials",
      types: [
        { type: SectionTypes['supporting-documents'], label: 'Supporting Documents', icon: Files },
        { type: SectionTypes['reference-tables'], label: 'Reference Tables', icon: Table2 },
        { type: SectionTypes.index, label: 'Index', icon: BookMarked },
        { type: SectionTypes.glossary, label: 'Glossary', icon: BookKey }
      ]
    }
  ];

  const backMatterSections = sections.filter(s => 
    backMatterGroups.some(group => 
      group.types.some(type => type.type === s.type)
    )
  );

  const renderAddButton = (type: string, label: string, Icon: React.ElementType) => {
    if (sections.some(s => s.type === type)) return null;
    
    return (
      <Button
        key={`add-${type}`}
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 gap-2"
        onClick={() => onAddSection?.(type)}
      >
        <Plus className="h-4 w-4" />
        <Icon className="h-4 w-4" />
        <span>Add {label}</span>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="px-3">
        <h3 className="text-sm font-semibold text-primary mb-4">Back Matter</h3>
        
        {backMatterGroups.map((group, index) => (
          <div key={group.title} className={cn("space-y-3", index > 0 && "mt-6")}>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {group.title}
            </div>
            
            <div className="space-y-2">
              {backMatterSections
                .filter(section => 
                  group.types.some(type => type.type === section.type)
                )
                .map(section => {
                  const typeInfo = group.types.find(t => t.type === section.type);
                  const Icon = typeInfo?.icon || FileText;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => onSectionSelect(section.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                        "hover:bg-primary/5",
                        activeSection === section.id && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Icon className="h-4 w-4 opacity-70" />
                      {section.title}
                    </button>
                  );
                })}
              
              {group.types.map(({ type, label, icon: Icon }) => 
                renderAddButton(type, label, Icon)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};