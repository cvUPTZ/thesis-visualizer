import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ListOrdered, 
  FileText, 
  BookMarked,
  GraduationCap,
  ScrollText,
  Plus
} from 'lucide-react';
import { ThesisSectionType } from '@/types/thesis';
import { getSectionsByGroup } from '@/utils/sectionTypes';

interface ThesisStructureNavbarProps {
  onAddSection: (type: ThesisSectionType) => void;
}

export const ThesisStructureNavbar: React.FC<ThesisStructureNavbarProps> = ({
  onAddSection
}) => {
  const frontMatterSections = getSectionsByGroup('frontMatter');
  const mainContentSections = getSectionsByGroup('mainContent');
  const backMatterSections = getSectionsByGroup('backMatter');

  console.log('Rendering ThesisStructureNavbar');

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-medium">Front Matter</span>
          <div className="flex items-center space-x-1">
            {frontMatterSections.map((section) => (
              <Button
                key={section.type}
                variant="ghost"
                size="sm"
                onClick={() => onAddSection(section.type)}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>{section.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-medium">Main Content</span>
          <div className="flex items-center space-x-1">
            {mainContentSections.map((section) => (
              <Button
                key={section.type}
                variant="ghost"
                size="sm"
                onClick={() => onAddSection(section.type)}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>{section.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ScrollText className="h-5 w-5 text-primary" />
          <span className="font-medium">Back Matter</span>
          <div className="flex items-center space-x-1">
            {backMatterSections.map((section) => (
              <Button
                key={section.type}
                variant="ghost"
                size="sm"
                onClick={() => onAddSection(section.type)}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>{section.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};