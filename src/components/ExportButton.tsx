import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export const ExportButton = ({ contentRef }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      if (!contentRef.current) {
        throw new Error('Content not found');
      }

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
        title: 'Success',
        description: 'Your thesis has been exported to PDF',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your thesis to PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="w-4 h-4 mr-2" />
      Export PDF
    </Button>
  );
};