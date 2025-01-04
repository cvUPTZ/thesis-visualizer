import React from 'react';
import { cn } from '@/lib/utils';
import { Section } from '@/types/thesis';
import { FileText, Star } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const ThesisSidebar = ({ sections, activeSection, onSectionSelect }: ThesisSidebarProps) => {
  return (
    <aside className="h-full bg-sidebar-background border-r border-sidebar-border p-4">
      <div className="mb-6">
        <h2 className="text-lg font-serif text-sidebar-primary font-semibold">Contents</h2>
      </div>
      <nav className="space-y-1">
        {sections.sort((a, b) => a.order - b.order).map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              "flex items-center gap-2 group",
              activeSection === section.id && "bg-sidebar-accent text-sidebar-primary font-medium"
            )}
          >
            {section.required ? (
              <Star className="w-4 h-4 text-sidebar-primary group-hover:text-sidebar-accent-foreground transition-colors" />
            ) : (
              <FileText className="w-4 h-4 text-sidebar-foreground group-hover:text-sidebar-accent-foreground transition-colors" />
            )}
            <span className="truncate text-sm">{section.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};