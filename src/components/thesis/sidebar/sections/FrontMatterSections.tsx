import React from 'react';
import { Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FrontMatterProps {
  sections: Section[];
  onSectionSelect: (id: string) => void;
  activeSection: string;
  onAddSection?: (type: string) => void;
}

export const FrontMatterSections: React.FC<FrontMatterProps> = ({
  sections,
  onSectionSelect,
  activeSection,
  onAddSection
}) => {
  const frontMatterTypes = ['title', 'acknowledgments', 'abstract', 'table-of-contents'];

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm px-2">Front Matter</h3>
      {sections
        .filter(s => frontMatterTypes.includes(s.type))
        .map(section => (
          <button
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            className={`flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full ${
              activeSection === section.id ? 'bg-accent' : ''
            }`}
          >
            {section.title}
          </button>
        ))}
    </div>
  );
};