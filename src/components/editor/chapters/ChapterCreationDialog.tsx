import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Chapter, Section, Figure, Table, Citation, Reference } from '@/types/thesis';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FigureUpload } from '../managers/FigureUpload';
import { TableDialog } from '../../table/TableDialog';
import { CitationSearch } from '../../citation/CitationSearch';
import { ReferenceDialog } from '../../reference/ReferenceDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChapterCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChapterCreate: (chapter: Chapter) => void;
}

export const ChapterCreationDialog: React.FC<ChapterCreationDialogProps> = ({
  open,
  onOpenChange,
  onChapterCreate,
}) => {
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [sections, setSections] = useState<Partial<Section>[]>([]);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const { toast } = useToast();

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: '',
        content: '',
        type: 'custom',
        order: sections.length + 1,
        figures: [],
        tables: [],
        citations: [],
        references: [],
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
    setSections(
      sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      
      // Create an HTMLImageElement to get dimensions
      const img = document.createElement('img');
      img.onload = () => {
        const newFigure: Figure = {
          id: Date.now().toString(),
          imageUrl,
          caption: '',
          altText: '',
          number: figures.length + 1,
          dimensions: {
            width: img.width,
            height: img.height
          }
        };
        setFigures([...figures, newFigure]);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Chapter title is required",
        variant: "destructive",
      });
      return;
    }

    const introductionSection: Section = {
      id: `${Date.now()}-intro`,
      title: 'Introduction',
      content: introduction,
      type: 'custom',
      order: 0,
      figures,
      tables,
      citations,
      references
    };

    const processedSections = sections.map((section, index) => ({
      ...section,
      id: section.id || Date.now().toString(),
      order: index + 1,
      type: 'custom',
      figures: section.figures || [],
      tables: section.tables || [],
      citations: section.citations || [],
      references: section.references || []
    })) as Section[];

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: title.trim(),
      content: introduction,
      order: 0,
      sections: [introductionSection, ...processedSections],
    };

    console.log('Creating new chapter:', newChapter);
    onChapterCreate(newChapter);
    onOpenChange(false);
    
    // Reset form
    setTitle('');
    setIntroduction('');
    setSections([]);
    setFigures([]);
    setTables([]);
    setCitations([]);
    setReferences([]);

    toast({
      title: "Success",
      description: "Chapter created successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Create New Chapter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chapter Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chapter title"
              className="w-full"
            />
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="figures">Figures</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="citations">Citations</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Chapter Introduction</label>
                <MarkdownEditor
                  value={introduction}
                  onChange={setIntroduction}
                  placeholder="Write your chapter introduction..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Sections</h3>
                  <Button
                    onClick={handleAddSection}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Section
                  </Button>
                </div>

                {sections.map((section, index) => (
                  <div key={section.id} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Input
                        value={section.title}
                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        placeholder="Section title"
                        className="flex-1 mr-2"
                      />
                      <Button
                        onClick={() => handleRemoveSection(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <MarkdownEditor
                      value={section.content}
                      onChange={(value) => handleSectionChange(index, 'content', value)}
                      placeholder="Write your section content..."
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="figures" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Figures</h3>
                <FigureUpload onUpload={handleFileUpload} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {figures.map((figure) => (
                  <div key={figure.id} className="border p-4 rounded-lg">
                    <img src={figure.imageUrl} alt={figure.altText} className="w-full h-40 object-contain" />
                    <Input
                      placeholder="Caption"
                      value={figure.caption}
                      onChange={(e) => {
                        const updatedFigures = figures.map(f =>
                          f.id === figure.id ? { ...f, caption: e.target.value } : f
                        );
                        setFigures(updatedFigures);
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
                <TableDialog onAddTable={(table) => setTables([...tables, table])} />
              </div>
              <div className="space-y-4">
                {tables.map((table) => (
                  <div key={table.id} className="border p-4 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: table.content }} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="citations" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Citations</h3>
                <CitationSearch onSelect={(citation) => setCitations([...citations, citation])} />
              </div>
              <div className="space-y-2">
                {citations.map((citation) => (
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
                <ReferenceDialog onAddReference={(reference) => setReferences([...references, reference])} />
              </div>
              <div className="space-y-2">
                {references.map((reference) => (
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="ml-2">
            Create Chapter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};