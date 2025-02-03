
import React, { useState, useCallback } from 'react';
import { Section, SectionType } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SectionManagers } from './SectionManagers';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save } from 'lucide-react';

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

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={localSection.title}
                onChange={handleTitleChange}
                className="text-2xl font-serif"
                placeholder="Section Title"
              />
              <Select
                value={localSection.type}
                onValueChange={(value: SectionType) => handleTypeChange(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select section type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SectionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ').toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-serif">{localSection.title}</h2>
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
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <MarkdownEditor
          value={typeof localSection.content === 'string' ? localSection.content : ''}
          onChange={handleContentChange}
          readOnly={!isEditing || readOnly}
          placeholder="Start writing your section content..."
        />
      </div>

      {isEditing && (
        <SectionManagers
          section={localSection}
          onSectionUpdate={setLocalSection}
        />
      )}
    </Card>
  );
};
