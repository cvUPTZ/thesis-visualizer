import React from 'react';
import { Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CitationStats } from './CitationStats';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CitationSearch } from './CitationSearch';

interface CitationHeaderProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  searchDialogOpen: boolean;
  setSearchDialogOpen: (open: boolean) => void;
  handleAddCitation: () => void;
  handleSearchResult: (citation: Omit<Citation, 'thesis_id'>) => void;
}

export const CitationHeader = ({
  citations,
  searchDialogOpen,
  setSearchDialogOpen,
  handleAddCitation,
  handleSearchResult
}: CitationHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <CitationStats citations={citations} />
      <div className="flex gap-2">
        <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Search Citations
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Search Citations</DialogTitle>
            </DialogHeader>
            <CitationSearch onSelect={handleSearchResult} />
          </DialogContent>
        </Dialog>
        <Button onClick={handleAddCitation} variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Citation
        </Button>
      </div>
    </div>
  );
};