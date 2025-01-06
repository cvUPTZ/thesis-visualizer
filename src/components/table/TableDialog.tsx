import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Table } from '@/types/thesis';

interface TableDialogProps {
  onAddTable: (table: Table) => void;
}

export const TableDialog = ({ onAddTable }: TableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    try {
      console.log('📊 Saving table from Google Sheets');
      
      if (!sheetUrl) {
        toast({
          title: "Error",
          description: "Please enter a Google Sheets URL",
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
      setSheetUrl('');
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
        <Button variant="outline" size="sm" className="gap-2 bg-white shadow-md hover:bg-gray-50">
          <Table2 className="w-4 h-4" />
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Create Table from Google Sheets</h2>
            <p className="text-sm text-muted-foreground mb-4">
              1. Create your table in Google Sheets
              <br />
              2. Click "Share" and set to "Anyone with the link can view"
              <br />
              3. Copy the URL and paste it below
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-gray-700">
                Google Sheets URL
              </label>
              <Input
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
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