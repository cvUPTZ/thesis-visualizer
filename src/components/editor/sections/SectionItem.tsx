import React from 'react';
import { Section } from '@/types/thesis';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionItemProps {
  section: Section;
  sectionNumber: number;
  onUpdateSection: (updatedSection: Section) => void;
}

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  sectionNumber,
  onUpdateSection,
}) => {
  return (
    <div className={cn(
      "border rounded-lg p-4 space-y-4 bg-gray-50/50 mb-4",
      "hover:shadow-sm transition-all duration-200",
      "group"
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg group-hover:bg-gray-100 transition-colors">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-gray-200 text-gray-700 font-medium px-2 py-1 rounded text-sm">
            {sectionNumber}
          </div>
          <Input
            value={section.title}
            onChange={(e) => onUpdateSection({ ...section, title: e.target.value })}
            className="text-lg font-medium bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary/20 px-2"
            placeholder="Section Title"
          />
        </div>
      </div>

      <Textarea
        value={section.content}
        onChange={(e) => onUpdateSection({ ...section, content: e.target.value })}
        className="min-h-[100px] bg-white border focus-visible:ring-1 focus-visible:ring-primary/20"
        placeholder="Start writing your section content..."
      />

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FileText className="w-4 h-4" />
        <span>{section.content.length} characters</span>
      </div>
    </div>
  );
};