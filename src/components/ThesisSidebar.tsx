// File: src/components/ThesisSidebar.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Section } from '@/types/thesis';
import { FileText, Star } from 'lucide-react';

interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const ThesisSidebar = ({ sections, activeSection, onSectionSelect }: ThesisSidebarProps) => {
  return (
    <aside className="w-64 bg-white border-r border-editor-border p-4">
      <div className="mb-6">
        <h2 className="text-lg font-serif text-primary font-semibold">Contents</h2>
      </div>
      <nav>
        {sections.sort((a, b) => a.order - b.order).map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md mb-1 flex items-center gap-2",
              "hover:bg-editor-bg transition-colors duration-200",
              activeSection === section.id && "bg-editor-bg text-primary font-medium"
            )}
          >
            {section.required ? (
              <Star className="w-4 h-4 fill-current" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="truncate">{section.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};