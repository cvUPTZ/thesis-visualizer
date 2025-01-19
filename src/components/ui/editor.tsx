import React from 'react';
import { ThesisSectionType } from '@/types/thesis';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  type: ThesisSectionType;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange, type }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full min-h-[200px] p-4 border rounded-md"
        placeholder={`Write your ${type} content here...`}
      />
    </div>
  );
};