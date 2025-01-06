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
  const { toast } = useToast();

  // Create a new spreadsheet when dialog opens
  const handleOpenDialog = () => {
    window.open('https://docs.google.com/spreadsheets/create', '_blank');
    setIsOpen(true);
  };

  const handleSave = () => {
    try {
      console.log('📊 Creating table from Google Sheets');
      
      const sheetUrl = document.getElementById('sheet-url') as HTMLInputElement;
      if (!sheetUrl?.value) {
        toast({
          title: "Error",
          description: "Please enter a Google Sheets URL",
          variant: "destructive",
        });
        return;
      }

      // Extract the embedded HTML from Google Sheets
      const embedUrl = sheetUrl.value.replace('/edit', '/preview');
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Table with Google Sheets</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Alert>
            <AlertDescription>
              <ol className="list-decimal pl-4 space-y-2">
                <li>A new Google Sheet has opened in a new tab</li>
                <li><strong>Enter your data</strong> in the Google Sheet</li>
                <li>Click the "Share" button in the top right</li>
                <li>Change access to "Anyone with the link can view"</li>
                <li>Copy the URL from your browser's address bar</li>
                <li>Paste the URL below</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-gray-700">
                Google Sheets URL
              </label>
              <Input
                id="sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Make sure your sheet is set to "Anyone with the link can view"
              </p>
            </div>

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
      </DialogContent>
    </Dialog>
  );
};