import React from 'react';
import { Table } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

interface TableCardProps {
  table: Table;
  onUpdate: (table: Table) => void;
  onRemove: (id: string) => void;
}

export const TableCard = ({ table, onUpdate, onRemove }: TableCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedCaption, setEditedCaption] = React.useState(table.caption || '');
  const [editedContent, setEditedContent] = React.useState(table.content || '');

  const handleSave = () => {
    onUpdate({
      ...table,
      caption: editedCaption,
      content: editedContent,
    });
    setIsEditing(false);
  };

  return (
    <Card className="group relative border-2 border-editor-border transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Table {table.id}
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Table Preview</DialogTitle>
              </DialogHeader>
              <div className="prose max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: table.content }} />
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(table.id)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-medium">Caption</label>
              <Input
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="mt-1 font-mono"
                rows={5}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Caption:</p>
            <p className="text-sm">{table.caption}</p>
            <p className="text-sm font-medium mt-4">Preview:</p>
            <div className="prose max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: table.content }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};