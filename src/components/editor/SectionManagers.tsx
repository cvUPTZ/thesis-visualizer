import React from 'react';
import { Section } from '@/types/thesis';

export interface SectionManagersProps {
  section: Section;
  onUpdate: (content: string) => Promise<void>;
}

export const SectionManagers: React.FC<SectionManagersProps> = ({ section, onUpdate }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => onUpdate(section.content)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Section
      </button>
      <span className="text-gray-500">{section.title}</span>
    </div>
  );
};
