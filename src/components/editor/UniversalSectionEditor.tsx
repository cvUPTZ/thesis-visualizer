
import React, { useState, useCallback } from 'react';
import { Section, SectionType } from '@/types/thesis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SectionManagers } from './SectionManagers';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, BookOpen, ListOrdered, Table, Quote, FileText, BookMarked, List, Image } from 'lucide-react';

interface UniversalSectionEditorProps {
  section: Section;
  onUpdate: (section: Section) => void;
  readOnly?: boolean;
}

export const UniversalSectionEditor: React.FC<UniversalSectionEditorProps> = ({
  section,
  onUpdate,
  readOnly = false
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [localSection, setLocalSection] = useState<Section>(section);

  const handleContentChange = useCallback((content: string) => {
    setLocalSection(prev => ({
      ...prev,
      content
    }));
  }, []);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSection(prev => ({
      ...prev,
      title: event.target.value
    }));
  }, []);

  const handleTypeChange = useCallback((type: SectionType) => {
    setLocalSection(prev => ({
      ...prev,
      type
    }));
  }, []);

  const handleSave = useCallback(() => {
    try {
      onUpdate(localSection);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Section updated successfully",
      });
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive"
      });
    }
  }, [localSection, onUpdate, toast]);

  const sectionTypeCards = [
    { type: SectionType.ABSTRACT, icon: FileText, color: 'bg-[#E5DEFF]' },
    { type: SectionType.INTRODUCTION, icon: BookOpen, color: 'bg-[#FDE1D3]' },
    { type: SectionType.CHAPTER, icon: BookMarked, color: 'bg-[#D3E4FD]' },
    { type: SectionType.METHODOLOGY, icon: ListOrdered, color: 'bg-[#F2FCE2]' },
    { type: SectionType.RESULTS, icon: Table, color: 'bg-[#FEF7CD]' },
    { type: SectionType.DISCUSSION, icon: Quote, color: 'bg-[#FFDEE2]' },
    { type: SectionType.CONCLUSION, icon: List, color: 'bg-[#F1F0FB]' },
    { type: SectionType.REFERENCES, icon: List, color: 'bg-[#FEC6A1]' },
  ];

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1 flex-1">
          {isEditing ? (
            <div className="space-y-6">
              <Input
                value={localSection.title}
                onChange={handleTitleChange}
                className="text-2xl font-serif"
                placeholder="Section Title"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sectionTypeCards.map(({ type, icon: Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`p-4 rounded-lg ${color} transition-all duration-200 hover:shadow-md ${
                      localSection.type === type ? 'ring-2 ring-[#9b87f5] shadow-lg' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {type.toLowerCase().replace(/_/g, ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl font-serif">{localSection.title}</CardTitle>
              <Badge variant="secondary" className="capitalize">
                {localSection.type.replace(/_/g, ' ').toLowerCase()}
              </Badge>
              {localSection.required && (
                <Badge variant="outline" className="bg-red-50">
                  Required
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit
              </>
            )}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <MarkdownEditor
            value={typeof localSection.content === 'string' ? localSection.content : ''}
            onChange={handleContentChange}
            readOnly={!isEditing || readOnly}
            placeholder="Start writing your section content..."
          />
        </div>

        {isEditing && (
          <div className="mt-6">
            <SectionManagers
              section={localSection}
              onSectionUpdate={setLocalSection}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
