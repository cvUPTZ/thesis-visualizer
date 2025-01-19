import React from 'react';
import { ThesisSectionType } from '@/types/thesis';

interface EditorProps {
  section: {
    id: string;
    title: string;
    content: string;
    type: ThesisSectionType;
  };
  onUpdate: (updatedSection: any) => void;
}

export const Editor: React.FC<EditorProps> = ({ section, onUpdate }) => {
  const handleNewSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      type: ThesisSectionType.Custom,
      order: 0,
      figures: [],
      tables: [],
      citations: [],
      references: []
    };
    onUpdate(newSection);
  };

  return (
    <div>
      <h2>{section.title}</h2>
      <textarea
        value={section.content}
        onChange={(e) => onUpdate({ ...section, content: e.target.value })}
      />
      <button onClick={handleNewSection}>Add Section</button>
    </div>
  );
};
