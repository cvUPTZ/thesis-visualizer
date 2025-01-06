import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Table } from '@/types/thesis';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TableDialogProps {
  onAddTable: (table: Table) => void;
}

export const TableDialog = ({ onAddTable }: TableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const { toast } = useToast();

  const handleOpenDialog = () => {
    const newSheetUrl = 'https://docs.google.com/spreadsheets/d/1/edit';
    setSheetUrl(newSheetUrl);
    setIsOpen(true);
  };

  const handleSave = () => {
    try {
      console.log('📊 Creating table from Google Sheets');
      
      if (!sheetUrl) {
        toast({
          title: "Error",
          description: "Please enter your table data in Google Sheets",
          variant: "destructive",
        });
        return;
      }

      // Extract the embedded HTML from Google Sheets
      const embedUrl = sheetUrl.replace('/edit', '/preview');
      const tableContent = `
        <div class="google-sheets-table">
          <iframe 
            src="${embedUrl}"
            style="width: 100%; min-height: 400px; border: none;"
            allowfullscreen
          ></iframe>
        </div>
      `;

      const newTable: Table = {
        id: Date.now().toString(),
        title: 'Google Sheets Table',
        content: tableContent,
        caption: caption
      };

      onAddTable(newTable);
      setIsOpen(false);
      setCaption('');
      setSheetUrl('');
      
      toast({
        title: "Success",
        description: "Table created from Google Sheets",
      });
      console.log('✅ Table saved successfully');
    } catch (error) {
      console.error('❌ Error creating table:', error);
      toast({
        title: "Error creating table",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-white shadow-md hover:bg-gray-50"
          onClick={handleOpenDialog}
        >
          <Table2 className="w-4 h-4" />
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Create Table with Google Sheets</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full space-y-4">
          <Alert>
            <AlertDescription>
              <p className="mb-2">Create your table directly in Google Sheets below:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Enter your data in the embedded Google Sheet</li>
                <li>Click "Share" in the top right and set to "Anyone with the link can view"</li>
                <li>Add a descriptive caption for your table</li>
                <li>Click "Create Table" when you're done</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="flex-grow border rounded-lg overflow-hidden bg-white">
            <iframe 
              src="https://docs.google.com/spreadsheets/d/1/edit?usp=sharing&embedded=true"
              className="w-full h-full border-none"
              title="Google Sheets Table Editor"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-gray-700">
                Table Caption
              </label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter a descriptive caption for your table..."
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                A good caption helps readers understand your table's content
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
              >
                Create Table
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};