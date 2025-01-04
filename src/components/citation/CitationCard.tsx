// File: src/components/citation/CitationCard.tsx
import React, { useState } from 'react';
import { Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Quote } from 'lucide-react';
import { TagInput } from '@/components/ui/tag-input';

interface CitationCardProps {
  citation: Citation;
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview?: () => void;
}

export const CitationCard = ({ citation, onRemove, onUpdate, onPreview }: CitationCardProps) => {
  const [authors, setAuthors] = useState(citation.authors)

  const handleAuthorChange = (tags: string[]) => {
    setAuthors(tags);
    onUpdate({...citation, authors: tags})
  }
  return (
    <Card className="border-2 border-editor-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Quote className="w-4 h-4 inline mr-2" />
          {citation.type.charAt(0).toUpperCase() + citation.type.slice(1)} Citation
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(citation.id)}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select
          value={citation.type}
          onValueChange={(value: CitationType) =>
            onUpdate({ ...citation, type: value })
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
            onUpdate({ ...citation, text: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Source"
          value={citation.source}
          onChange={(e) =>
            onUpdate({ ...citation, source: e.target.value })
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
            onUpdate({ ...citation, year: e.target.value })
          }
        />
      </CardContent>
    </Card>
  );
};
