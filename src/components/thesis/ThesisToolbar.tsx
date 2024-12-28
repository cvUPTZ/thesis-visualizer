import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff, Save, Users } from 'lucide-react';
import { ThesisSaveButton } from './ThesisSaveButton';
import { Thesis } from '@/types/thesis';
import { generateThesisDocx } from '@/utils/docxExport';
import { Packer } from 'docx';
import { useToast } from '@/hooks/use-toast';
import { CollaboratorsList } from './CollaboratorsList';

interface ThesisToolbarProps {
  thesisId: string;
  thesisData: Thesis;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const ThesisToolbar = ({
  thesisId,
  thesisData,
  showPreview,
  onTogglePreview,
}: ThesisToolbarProps) => {
  const { toast } = useToast();

  const handleExportDocx = async () => {
    try {
      const doc = generateThesisDocx(thesisData);
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${thesisData.frontMatter[0]?.title || 'thesis'}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Your thesis has been exported as a DOCX file.",
      });
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      toast({
        title: "Error",
        description: "Failed to export thesis as DOCX. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ThesisSaveButton thesisId={thesisId} thesisData={thesisData} />
        <Button onClick={handleExportDocx} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export DOCX
        </Button>
        <CollaboratorsList thesisId={thesisId} />
      </div>
      <Button onClick={onTogglePreview} variant="outline" className="gap-2">
        {showPreview ? (
          <>
            <EyeOff className="h-4 w-4" />
            Hide Preview
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Show Preview
          </>
        )}
      </Button>
    </div>
  );
};