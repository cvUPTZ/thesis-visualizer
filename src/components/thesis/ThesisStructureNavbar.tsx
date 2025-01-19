import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ThesisSectionType } from '@/types/thesis';
import { getSectionsByGroup, getSectionConfig } from '@/utils/sectionTypes';

interface ThesisStructureNavbarProps {
  onAddSection: (type: ThesisSectionType) => void;
}

export const ThesisStructureNavbar: React.FC<ThesisStructureNavbarProps> = ({
  onAddSection
}) => {
  const frontMatterSections = getSectionsByGroup('frontMatter');
  const mainContentSections = getSectionsByGroup('mainContent');
  const backMatterSections = getSectionsByGroup('backMatter');

  return (
    <NavigationMenu className="max-w-none w-full justify-start">
      <NavigationMenuList className="space-x-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Front Matter</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-4 w-[400px]">
              {frontMatterSections.map((section) => {
                const config = getSectionConfig(section.type);
                return (
                  <Button
                    key={section.type}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => onAddSection(section.type)}
                  >
                    <config.icon className="mr-2 h-4 w-4" />
                    <span>{config.label}</span>
                    <Plus className="ml-auto h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Main Content</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-4 w-[400px]">
              {mainContentSections.map((section) => {
                const config = getSectionConfig(section.type);
                return (
                  <Button
                    key={section.type}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => onAddSection(section.type)}
                  >
                    <config.icon className="mr-2 h-4 w-4" />
                    <span>{config.label}</span>
                    <Plus className="ml-auto h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Back Matter</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-4 w-[400px]">
              {backMatterSections.map((section) => {
                const config = getSectionConfig(section.type);
                return (
                  <Button
                    key={section.type}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => onAddSection(section.type)}
                  >
                    <config.icon className="mr-2 h-4 w-4" />
                    <span>{config.label}</span>
                    <Plus className="ml-auto h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};