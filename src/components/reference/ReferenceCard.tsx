import React, { useState } from 'react';
import { Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Trash2, Edit2, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from '@/components/ui/tag-input';
import { useToast } from '@/hooks/use-toast';

interface ReferenceCardProps {
  reference: Reference;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
  onClick?: (reference: Reference) => void;
}

export const ReferenceCard = ({ reference, onRemove, onUpdate, onClick }: ReferenceCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const { toast } = useToast();
  const [editedReference, setEditedReference] = React.useState<Reference>(reference);

  const handleClick = () => {
    if (!isEditing && onClick) {
      onClick(reference);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  const handleSave = () => {
    onUpdate(editedReference);
    setIsEditing(false);
    toast({
      title: "Reference Updated",
      description: "The reference has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditedReference(reference);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Reference, value: any) => {
    setEditedReference(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card 
      className={`group relative border-2 border-editor-border transition-all duration-200 hover:shadow-lg ${!isEditing ? 'cursor-pointer hover:border-primary/50' : ''}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={isEditing ? -1 : 0}
      role={isEditing ? undefined : 'button'}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <BookOpen className="w-4 h-4 inline mr-2" />
          {reference.type.charAt(0).toUpperCase() + reference.type.slice(1)}
        </CardTitle>
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(reference.id);
            }}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {reference.url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(reference.url, '_blank');
              }}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4 animate-fade-in">
            <Select
              value={editedReference.type}
              onValueChange={(value: any) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="thesis">Thesis</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Title"
              value={editedReference.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <TagInput
              placeholder="Authors (comma-separated)"
              tags={editedReference.authors}
              onChange={(tags) => handleChange('authors', tags)}
            />
            <Input
              placeholder="Year"
              value={editedReference.year}
              onChange={(e) => handleChange('year', e.target.value)}
            />
            {editedReference.type === 'article' && (
              <>
                <Input
                  placeholder="DOI"
                  value={editedReference.doi || ''}
                  onChange={(e) => handleChange('doi', e.target.value)}
                />
                <Input
                  placeholder="Journal"
                  value={editedReference.journal || ''}
                  onChange={(e) => handleChange('journal', e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Volume"
                    value={editedReference.volume || ''}
                    onChange={(e) => handleChange('volume', e.target.value)}
                  />
                  <Input
                    placeholder="Issue"
                    value={editedReference.issue || ''}
                    onChange={(e) => handleChange('issue', e.target.value)}
                  />
                  <Input
                    placeholder="Pages"
                    value={editedReference.pages || ''}
                    onChange={(e) => handleChange('pages', e.target.value)}
                  />
                </div>
              </>
            )}
            {(editedReference.type === 'website' || editedReference.type === 'other') && (
              <Input
                placeholder="URL"
                value={editedReference.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
              />
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
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
                <a 
                  href={reference.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
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