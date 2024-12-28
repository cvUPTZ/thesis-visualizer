import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export const ExportButton = ({ contentRef }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    if (!contentRef.current) return;

    try {
      // Import the library dynamically
      const ReactToPdf = await import('react-to-pdf');
      
      // Generate the PDF using the correct method
      await ReactToPdf.default(() => contentRef.current, {
        filename: 'thesis.pdf',
        page: {
          margin: 20,
          format: 'letter',
        },
      });
      
      toast({
        title: "Export Successful",
        description: "Your thesis has been exported to PDF",
      });
    } catch (error) {
      console.error('PDF Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your thesis",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <FileDown className="h-4 w-4" />
      Export PDF
    </Button>
  );
};