import React from 'react';
import { Footnote } from '@/types/thesis';

interface FootnoteManagerProps {
  thesisId: string;
  sectionId: string;
  footnotes: Footnote[];
  onUpdate: (footnotes: Footnote[]) => void;
}

export const FootnoteManager: React.FC<FootnoteManagerProps> = ({
  thesisId,
  sectionId,
  footnotes,
  onUpdate
}) => {
  const handleAddFootnote = () => {
    const newFootnote: Footnote = {
      id: Date.now().toString(),
      thesis_id: thesisId,
      section_id: sectionId,
      content: '',
      number: (footnotes.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    onUpdate([...footnotes, newFootnote]);
  };

  const handleRemoveFootnote = (id: string) => {
    onUpdate(footnotes.filter(footnote => footnote.id !== id));
  };

  const handleUpdateFootnote = (id: string, content: string) => {
    const updatedFootnotes = footnotes.map(footnote =>
      footnote.id === id ? { ...footnote, content } : footnote
    );
    onUpdate(updatedFootnotes);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Footnotes</h3>
      <button onClick={handleAddFootnote} className="btn btn-primary">
        Add Footnote
      </button>
      <ul>
        {footnotes.map(footnote => (
          <li key={footnote.id} className="flex items-center">
            <input
              type="text"
              value={footnote.content}
              onChange={(e) => handleUpdateFootnote(footnote.id, e.target.value)}
              className="border p-2 rounded"
              placeholder="Footnote content"
            />
            <button onClick={() => handleRemoveFootnote(footnote.id)} className="ml-2 btn btn-danger">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
