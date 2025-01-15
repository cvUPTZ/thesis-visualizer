import React from 'react';
import { Chapter, Table } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { TableDialog } from '../../table/TableDialog';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChapterTablesProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterTables: React.FC<ChapterTablesProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const { toast } = useToast();

  const handleAddTable = (table: Table) => {
    if (chapter.sections[0]) {
      const updatedSections = [...chapter.sections];
      updatedSections[0] = {
        ...updatedSections[0],
        tables: [...(updatedSections[0].tables || []), table]
      };

      onUpdateChapter({
        ...chapter,
        sections: updatedSections
      });

      toast({
        title: "Table Added",
        description: "New table has been added to the chapter",
      });
    }
  };

  const handleRemoveTable = (tableId: string) => {
    const updatedSections = chapter.sections.map(section => ({
      ...section,
      tables: section.tables.filter(t => t.id !== tableId)
    }));

    onUpdateChapter({
      ...chapter,
      sections: updatedSections
    });

    toast({
      title: "Table Removed",
      description: "Table has been removed from the chapter",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Tables</h3>
        <TableDialog onAddTable={handleAddTable} />
      </div>
      <div className="space-y-4">
        {chapter.sections[0]?.tables?.map((table) => (
          <div key={table.id} className="border p-4 rounded-lg group relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveTable(table.id)}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div dangerouslySetInnerHTML={{ __html: table.content }} />
          </div>
        ))}
      </div>
    </div>
  );
};