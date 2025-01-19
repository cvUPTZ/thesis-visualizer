import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ListOrdered, 
  FileText, 
  BookMarked,
  GraduationCap,
  ScrollText,
  Plus,
  ChevronDown
} from 'lucide-react';
import { ThesisSectionType } from '@/types/thesis';
import { getSectionsByGroup } from '@/utils/sectionTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        {/* Front Matter Section */}
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-medium">Front Matter</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {frontMatterSections.map((section) => (
                <DropdownMenuItem
                  key={section.type}
                  onClick={() => onAddSection(section.type)}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content Section */}
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-medium">Main Content</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {mainContentSections.map((section) => (
                <DropdownMenuItem
                  key={section.type}
                  onClick={() => onAddSection(section.type)}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Back Matter Section */}
        <div className="flex items-center space-x-2">
          <ScrollText className="h-5 w-5 text-primary" />
          <span className="font-medium">Back Matter</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {backMatterSections.map((section) => (
                <DropdownMenuItem
                  key={section.type}
                  onClick={() => onAddSection(section.type)}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};