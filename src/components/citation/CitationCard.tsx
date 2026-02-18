import React, { useState } from 'react';
import { Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Quote, Edit2, Eye } from 'lucide-react';
import { TagInput } from '@/components/ui/tag-input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitationCardProps {
  citation: Citation;
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview?: () => void;
}

export const CitationCard = ({ citation, onRemove, onUpdate, onPreview }: CitationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [authors, setAuthors] = useState(citation.authors);
  const { toast } = useToast();

  const handleRemove = async () => {
    try {
      const { error } = await (supabase.from('citations' as any) as any)
        .delete()
        .eq('id', citation.id);

      if (error) throw error;

      onRemove(citation.id);
      toast({
        title: "Success",
        description: "Citation removed successfully",
      });
    } catch (error: any) {
      console.error('Error removing citation:', error);
      toast({
        title: "Error",
        description: "Failed to remove citation: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (updatedFields: Partial<Citation>) => {
    try {
      const updatedCitation = { ...citation, ...updatedFields };
      
      const { error } = await (supabase.from('citations' as any) as any)
        .update(updatedCitation)
        .eq('id', citation.id);

      if (error) throw error;

      onUpdate(updatedCitation);
      toast({
        title: "Success",
        description: "Citation updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating citation:', error);
      toast({
        title: "Error",
        description: "Failed to update citation: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleAuthorChange = (tags: string[]) => {
    setAuthors(tags);
    handleUpdate({ authors: tags });
  };

  return (
    <Card className="group relative border-2 border-editor-border transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Quote className="w-4 h-4 inline mr-2" />
          {citation.type.charAt(0).toUpperCase() + citation.type.slice(1)} Citation
        </CardTitle>
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreview}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select
          value={citation.type}
          onValueChange={(value: any) =>
            handleUpdate({ type: value as any })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Text"
          value={citation.text}
          onChange={(e) =>
            handleUpdate({ text: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Source"
          value={citation.source}
          onChange={(e) =>
            handleUpdate({ source: e.target.value })
          }
          className="mb-2"
        />
        <TagInput
          placeholder="Authors (comma-separated)"
          tags={authors}
          onChange={handleAuthorChange}
        />
        <Input
          placeholder="Year"
          value={citation.year}
          onChange={(e) =>
            handleUpdate({ year: e.target.value })
          }
        />
        {citation.type === 'article' && (
          <div className="space-y-2 animate-fade-in">
            <Input
              placeholder="Journal"
              value={citation.journal}
              onChange={(e) =>
                handleUpdate({ journal: e.target.value })
              }
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Volume"
                value={citation.volume}
                onChange={(e) =>
                  handleUpdate({ volume: e.target.value })
                }
              />
              <Input
                placeholder="Issue"
                value={citation.issue}
                onChange={(e) =>
                  handleUpdate({ issue: e.target.value })
                }
              />
              <Input
                placeholder="Pages"
                value={citation.pages}
                onChange={(e) =>
                  handleUpdate({ pages: e.target.value })
                }
              />
            </div>
          </div>
        )}
        {citation.type === 'book' && (
          <Input
            placeholder="Publisher"
            value={citation.publisher}
            onChange={(e) =>
              handleUpdate({ publisher: e.target.value })
            }
            className="animate-fade-in"
          />
        )}
        {(citation.type === 'website' || citation.type === 'other') && (
          <Input
            placeholder="URL"
            value={citation.url}
            onChange={(e) =>
              handleUpdate({ url: e.target.value })
            }
            className="animate-fade-in"
          />
        )}
      </CardContent>
    </Card>
  );
};