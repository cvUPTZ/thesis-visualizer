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
import { PlusCircle, X } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Citations</h3>
        <Button onClick={handleAddCitation} variant="outline" size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Citation
        </Button>
      </div>
      {citations.map((citation) => (
        <div key={citation.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <Select
              value={citation.type}
              onValueChange={(value: any) =>
                onUpdateCitation({ ...citation, type: value })
              }
            >
              <SelectTrigger className="w-[180px]">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveCitation(citation.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
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
        </div>
      ))}
    </div>
  );
};