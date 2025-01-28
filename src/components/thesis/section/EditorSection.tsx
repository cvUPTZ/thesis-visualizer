import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { Section } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis } = useThesisData(thesisId);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    if (!thesis || !sectionId) {
      setIsLoading(false);
      return;
    }

    const findSection = () => {
      if (!thesis?.content) return null;

      // Check general introduction
      if (thesis.content.generalIntroduction?.id === sectionId) {
        return thesis.content.generalIntroduction;
      }

      // Check general conclusion
      if (thesis.content.generalConclusion?.id === sectionId) {
        return thesis.content.generalConclusion;
      }

      // Check front matter
      const frontMatterSection = thesis.content.frontMatter?.find(s => s.id === sectionId);
      if (frontMatterSection) return frontMatterSection;

      // Check back matter
      const backMatterSection = thesis.content.backMatter?.find(s => s.id === sectionId);
      if (backMatterSection) return backMatterSection;

      // Check chapters
      if (thesis.content.chapters) {
        for (const chapter of thesis.content.chapters) {
          const section = chapter.sections.find(s => s.id === sectionId);
          if (section) return section;
        }
      }

      return null;
    };

    const section = findSection();
    setSection(section);
    setIsLoading(false);
  }, [thesis, sectionId]);

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section) return;

    try {
      const updatedThesis = { ...thesis };
      
      if (section.id === thesis.content.generalIntroduction?.id) {
        updatedThesis.content.generalIntroduction = {
          ...thesis.content.generalIntroduction,
          content: newContent
        };
      } else if (section.id === thesis.content.generalConclusion?.id) {
        updatedThesis.content.generalConclusion = {
          ...thesis.content.generalConclusion,
          content: newContent
        };
      } else {
        // Update in front matter
        const frontMatterIndex = thesis.content.frontMatter?.findIndex(s => s.id === section.id);
        if (frontMatterIndex !== -1) {
          updatedThesis.content.frontMatter[frontMatterIndex] = {
            ...thesis.content.frontMatter[frontMatterIndex],
            content: newContent
          };
        } else {
          // Update in chapters
          updatedThesis.content.chapters = thesis.content.chapters.map(chapter => ({
            ...chapter,
            sections: chapter.sections.map(s => 
              s.id === section.id ? { ...s, content: newContent } : s
            )
          }));
        }
      }

      setThesis(updatedThesis);
      setSection({ ...section, content: newContent });

      toast({
        title: "Success",
        description: "Section content updated",
      });
    } catch (err) {
      console.error('Error updating section:', err);
      toast({
        title: "Error",
        description: "Failed to update section content",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-destructive">Section not found</h1>
          <p className="mt-4 text-muted-foreground">
            The requested section could not be found. Please check the URL and try again.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton onClick={() => navigate('/')}>
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Back to Home</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton onClick={() => navigate(`/thesis/${thesisId}`)}>
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Thesis</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Back to Thesis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 p-8">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">{section.title}</h1>
            <MarkdownEditor
              value={section.content as string}
              onChange={handleContentChange}
              placeholder="Start writing your section content..."
            />
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}