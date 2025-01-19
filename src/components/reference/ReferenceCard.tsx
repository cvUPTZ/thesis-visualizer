import React from 'react';
import { Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Trash2, Edit2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from '@/components/ui/tag-input';

interface ReferenceCardProps {
  reference: Reference;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export const ReferenceCard = ({ reference, onRemove, onUpdate }: ReferenceCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <Card className="group relative border-2 border-editor-border transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <BookOpen className="w-4 h-4 inline mr-2" />
          {reference.style} Style
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(reference.id)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-4 animate-fade-in">
            <Select
              value={reference.style}
              onValueChange={(value: 'APA' | 'MLA' | 'Chicago' | 'Vancouver' | 'Harvard') =>
                onUpdate({ ...reference, style: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APA">APA</SelectItem>
                <SelectItem value="MLA">MLA</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Vancouver">Vancouver</SelectItem>
                <SelectItem value="Harvard">Harvard</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Title"
              value={reference.title}
              onChange={(e) =>
                onUpdate({ ...reference, title: e.target.value })
              }
            />
            <TagInput
              placeholder="Authors (comma-separated)"
              tags={reference.authors}
              onChange={(tags) =>
                onUpdate({ ...reference, authors: tags })
              }
            />
            <Input
              placeholder="Year"
              value={reference.year}
              onChange={(e) =>
                onUpdate({ ...reference, year: e.target.value })
              }
            />
            <Input
              placeholder="DOI"
              value={reference.doi}
              onChange={(e) =>
                onUpdate({ ...reference, doi: e.target.value })
              }
            />
            <Input
              placeholder="Journal"
              value={reference.journal}
              onChange={(e) =>
                onUpdate({ ...reference, journal: e.target.value })
              }
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Volume"
                value={reference.volume}
                onChange={(e) =>
                  onUpdate({ ...reference, volume: e.target.value })
                }
              />
              <Input
                placeholder="Issue"
                value={reference.issue}
                onChange={(e) =>
                  onUpdate({ ...reference, issue: e.target.value })
                }
              />
              <Input
                placeholder="Pages"
                value={reference.pages}
                onChange={(e) =>
                  onUpdate({ ...reference, pages: e.target.value })
                }
              />
            </div>
            <Input
              placeholder="URL"
              value={reference.url}
              onChange={(e) =>
                onUpdate({ ...reference, url: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="font-medium">{reference.title}</h4>
            <p className="text-sm text-muted-foreground">
              {reference.authors.join(', ')} ({reference.year})
            </p>
            {reference.journal && (
              <p className="text-sm italic">{reference.journal}</p>
            )}
            {reference.doi && (
              <p className="text-sm">DOI: {reference.doi}</p>
            )}
            {reference.url && (
              <p className="text-sm">
                <a href={reference.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {reference.url}
                </a>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};