import React from 'react';
import { Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';

interface BackMatterProps {
  sections: Section[];
  onSectionSelect: (id: string) => void;
  activeSection: string;
}

export const BackMatterSections: React.FC<BackMatterProps> = ({
  sections,
  onSectionSelect,
  activeSection
}) => {
  const backMatterTypes = ['bibliography', 'appendix'];

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm px-2">Back Matter</h3>
      {sections
        .filter(s => backMatterTypes.includes(s.type))
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