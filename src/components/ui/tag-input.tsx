import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TagInputProps {
    placeholder?: string;
    tags: string[];
    onChange: (tags: string[]) => void;
}

export const TagInput = ({ placeholder, tags: initialTags, onChange }: TagInputProps) => {
    const [tags, setTags] = useState(initialTags);
    const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

  useEffect(() => {
        onChange(tags)
   }, [tags, onChange])


  const handleAddTag = useCallback(() => {
        const trimmedValue = inputValue.trim();
       if (trimmedValue && !tags.includes(trimmedValue)) {
            setTags(prevTags => [...prevTags, trimmedValue]);
            setInputValue('');
        }
  }, [inputValue, tags]);

   const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
     if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault(); // Prevents the default form submission when pressing enter.
          handleAddTag();
        }
   }, [handleAddTag]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
        setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
   }, []);


    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                  placeholder={placeholder}
                 value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <Button type="button" size="sm" onClick={handleAddTag} disabled={!inputValue.trim()}>
                  Add
                </Button>
            </div>
             <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                  <div key={tag} className="bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                    <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                      onClick={() => handleRemoveTag(tag)}
                          className="p-0 h-5 w-5"
                      >
                          <X className="w-3 h-3" />
                      </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};