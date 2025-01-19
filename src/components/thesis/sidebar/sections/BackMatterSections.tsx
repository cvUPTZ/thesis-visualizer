import React from 'react';
import { Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SectionTypes } from '@/types/thesis';

interface BackMatterProps {
  sections: Section[];
  onSectionSelect: (id: string) => void;
  activeSection: string;
  onAddSection?: (type: keyof typeof SectionTypes) => void;
}

export const BackMatterSections: React.FC<BackMatterProps> = ({
  sections,
  onSectionSelect,
  activeSection,
  onAddSection
}) => {
  console.log('Rendering BackMatterSections with:', { sectionsCount: sections.length });

  const backMatterTypes = [
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
  ] as const;

  const backMatterSections = sections.filter(s => backMatterTypes.includes(s.type as any));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm px-2">Back Matter</h3>
        <div className="flex gap-2">
          {!sections.some(s => s.type === 'bibliography') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => onAddSection?.('bibliography')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Bibliography
            </Button>
          )}
          {!sections.some(s => s.type === 'appendix') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => onAddSection?.('appendix')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Appendix
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {backMatterSections.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            className={`flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors ${
              activeSection === section.id ? 'bg-accent' : ''
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>
    </div>
  );
};