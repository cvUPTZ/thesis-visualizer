import React, { useState } from 'react';
import { Chapter, Section, Figure, Table, Citation, Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SectionItem } from '../sections/SectionItem';
import { ChevronDown, ChevronUp, GripVertical, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FigureUpload } from '../managers/FigureUpload';
import { TableDialog } from '../../table/TableDialog';
import { CitationSearch } from '../../citation/CitationSearch';
import { ReferenceDialog } from '../../reference/ReferenceDialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChapterItemProps {
  chapter: Chapter;
  chapterNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterNumber,
  isOpen,
  onToggle,
  onUpdateChapter,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');

  const handleContentChange = (content: string) => {
    onUpdateChapter({
      ...chapter,
      content
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateChapter({
      ...chapter,
      title: e.target.value
    });
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      type: 'custom',
      order: chapter.sections.length + 1,
      figures: [],
      tables: [],
      citations: [],
      references: []
    };

    onUpdateChapter({
      ...chapter,
      sections: [...chapter.sections, newSection]
    });

    toast({
      title: "Section Added",
      description: "New section has been added to the chapter",
    });
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      
      // Create a temporary image to get dimensions
      const img = document.createElement('img');
      img.onload = () => {
        const newFigure: Figure = {
          id: Date.now().toString(),
          imageUrl,
          caption: '',
          altText: '',
          number: (chapter.sections[0]?.figures?.length || 0) + 1,
          dimensions: {
            width: img.width,
            height: img.height
          }
        };

        // Add figure to the first section
        if (chapter.sections[0]) {
          const updatedSections = [...chapter.sections];
          updatedSections[0] = {
            ...updatedSections[0],
            figures: [...(updatedSections[0].figures || []), newFigure]
          };

          onUpdateChapter({
            ...chapter,
            sections: updatedSections
          });

          toast({
            title: "Figure Added",
            description: "New figure has been added to the chapter",
          });
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleAddTable = (table: Table) => {
    if (chapter.sections[0]) {
      const updatedSections = [...chapter.sections];
      updatedSections[0] = {
        ...updatedSections[0],
        tables: [...(updatedSections[0].tables || []), table]
      };

      onUpdateChapter({
        ...chapter,
        sections: updatedSections
      });

      toast({
        title: "Table Added",
        description: "New table has been added to the chapter",
      });
    }
  };

  const handleAddCitation = (citation: Citation) => {
    if (chapter.sections[0]) {
      const updatedSections = [...chapter.sections];
      updatedSections[0] = {
        ...updatedSections[0],
        citations: [...(updatedSections[0].citations || []), citation]
      };

      onUpdateChapter({
        ...chapter,
        sections: updatedSections
      });

      toast({
        title: "Citation Added",
        description: "New citation has been added to the chapter",
      });
    }
  };

  const handleAddReference = (reference: Reference) => {
    if (chapter.sections[0]) {
      const updatedSections = [...chapter.sections];
      updatedSections[0] = {
        ...updatedSections[0],
        references: [...(updatedSections[0].references || []), reference]
      };

      onUpdateChapter({
        ...chapter,
        sections: updatedSections
      });

      toast({
        title: "Reference Added",
        description: "New reference has been added to the chapter",
      });
    }
  };

  return (
    <div className={cn(
      "border rounded-xl bg-white shadow-sm transition-all duration-200",
      "hover:shadow-md",
      isOpen && "ring-2 ring-primary/10"
    )}>
      <div 
        className="p-4 flex items-center justify-between group cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-md">
              Ch. {chapterNumber}
            </div>
            <Input
              value={chapter.title}
              onChange={handleTitleChange}
              className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 w-full min-w-[300px]"
              placeholder="Chapter Title"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {chapter.sections.length} {chapter.sections.length === 1 ? 'section' : 'sections'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="figures">Figures</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="citations">Citations</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="pt-4 border-t space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Chapter Introduction</label>
                  <MarkdownEditor
                    value={chapter.content || ''}
                    onChange={handleContentChange}
                    placeholder="Write your chapter introduction here..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Sections</h3>
                    <Button
                      onClick={handleAddSection}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Section
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {chapter.sections.map((section, index) => (
                      <SectionItem
                        key={section.id}
                        section={section}
                        sectionNumber={index + 1}
                        onUpdateSection={(updatedSection) => {
                          onUpdateChapter({
                            ...chapter,
                            sections: chapter.sections.map((s) =>
                              s.id === updatedSection.id ? updatedSection : s
                            ),
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="figures" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Figures</h3>
                <FigureUpload onUpload={handleFileUpload} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {chapter.sections[0]?.figures?.map((figure) => (
                  <div key={figure.id} className="border p-4 rounded-lg">
                    <img src={figure.imageUrl} alt={figure.altText} className="w-full h-40 object-contain" />
                    <Input
                      placeholder="Caption"
                      value={figure.caption}
                      onChange={(e) => {
                        const updatedSections = [...chapter.sections];
                        updatedSections[0].figures = updatedSections[0].figures.map(f =>
                          f.id === figure.id ? { ...f, caption: e.target.value } : f
                        );
                        onUpdateChapter({
                          ...chapter,
                          sections: updatedSections
                        });
                      }}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tables" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Tables</h3>
                <TableDialog onAddTable={handleAddTable} />
              </div>
              <div className="space-y-4">
                {chapter.sections[0]?.tables?.map((table) => (
                  <div key={table.id} className="border p-4 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: table.content }} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="citations" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Citations</h3>
                <CitationSearch onSelect={handleAddCitation} />
              </div>
              <div className="space-y-2">
                {chapter.sections[0]?.citations?.map((citation) => (
                  <div key={citation.id} className="border p-4 rounded-lg">
                    <p className="font-medium">{citation.text}</p>
                    <p className="text-sm text-gray-600">
                      {citation.authors.join(', ')} ({citation.year})
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="references" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">References</h3>
                <ReferenceDialog onAddReference={handleAddReference} />
              </div>
              <div className="space-y-2">
                {chapter.sections[0]?.references?.map((reference) => (
                  <div key={reference.id} className="border p-4 rounded-lg">
                    <p className="font-medium">{reference.title}</p>
                    <p className="text-sm text-gray-600">
                      {reference.authors.join(', ')} ({reference.year})
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};