import React from 'react';
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
import { PlusCircle, X, Quote } from 'lucide-react';

interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
}

export const CitationManager = ({
  citations,
  onAddCitation,
  onRemoveCitation,
  onUpdateCitation
}: CitationManagerProps) => {
  const handleAddCitation = () => {
    const newCitation: Citation = {
      id: Date.now().toString(),
      text: '',
      source: '',
      authors: [''],
      year: '',
      type: 'article'
    };
    onAddCitation(newCitation);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">Citations</h3>
        <Button onClick={handleAddCitation} variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Citation
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {citations.map((citation) => (
          <Card key={citation.id} className="border-2 border-editor-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Quote className="w-4 h-4 inline mr-2" />
                {citation.type.charAt(0).toUpperCase() + citation.type.slice(1)} Citation
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveCitation(citation.id)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={citation.type}
                onValueChange={(value: any) =>
                  onUpdateCitation({ ...citation, type: value })
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
                  onUpdateCitation({ ...citation, text: e.target.value })
                }
                className="mb-2"
              />
              <Input
                placeholder="Source"
                value={citation.source}
                onChange={(e) =>
                  onUpdateCitation({ ...citation, source: e.target.value })
                }
                className="mb-2"
              />
              <Input
                placeholder="Authors (comma-separated)"
                value={citation.authors.join(', ')}
                onChange={(e) =>
                  onUpdateCitation({
                    ...citation,
                    authors: e.target.value.split(',').map((a) => a.trim())
                  })
                }
                className="mb-2"
              />
              <Input
                placeholder="Year"
                value={citation.year}
                onChange={(e) =>
                  onUpdateCitation({ ...citation, year: e.target.value })
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};