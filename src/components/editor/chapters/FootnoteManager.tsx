import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Footnote } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface FootnoteManagerProps {
  footnotes: Footnote[];
  onAddFootnote: (footnote: Footnote) => void;
  onRemoveFootnote: (id: string) => void;
  onUpdateFootnote: (footnote: Footnote) => void;
}

export const FootnoteManager: React.FC<FootnoteManagerProps> = ({
  footnotes,
  onAddFootnote,
  onRemoveFootnote,
  onUpdateFootnote,
}) => {
  const { toast } = useToast();

  const handleAddFootnote = () => {
    const newFootnote: Footnote = {
      id: uuidv4(),
      content: '',
      number: (footnotes?.length || 0) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAddFootnote(newFootnote);
    toast({
      title: "Footnote Added",
      description: "New footnote has been created",
    });
  };

  const handleUpdateFootnote = (id: string, content: string) => {
    const footnote = footnotes.find(f => f.id === id);
    if (footnote) {
      onUpdateFootnote({
        ...footnote,
        content,
        updated_at: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Footnotes</h3>
        <Button
          onClick={handleAddFootnote}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Footnote
        </Button>
      </div>

      <div className="space-y-4">
        {footnotes?.map((footnote) => (
          <div
            key={footnote.id}
            className="flex items-start gap-4 p-4 border rounded-lg bg-background"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-muted rounded-full">
              {footnote.number}
            </div>
            <div className="flex-grow space-y-2">
              <Textarea
                value={footnote.content}
                onChange={(e) => handleUpdateFootnote(footnote.id, e.target.value)}
                placeholder="Enter footnote content..."
                className="min-h-[100px]"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFootnote(footnote.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};