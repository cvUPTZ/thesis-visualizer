import React from 'react';
import { Section } from '@/types/thesis';
import { ThesisSidebarProps } from '@/types/components';

export const TableOfContents: React.FC<ThesisSidebarProps> = ({ sections, activeSection, onSectionSelect }) => {
  return (
    <div className="sidebar">
      <h2 className="text-lg font-semibold">Table of Contents</h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id} className={`cursor-pointer ${activeSection === section.id ? 'font-bold' : ''}`} onClick={() => onSectionSelect(section.id)}>
            {section.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
