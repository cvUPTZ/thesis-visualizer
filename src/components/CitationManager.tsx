import React, { useState, useMemo } from 'react';
import { Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { CitationCard } from './citation/CitationCard';
import { CitationPreview } from './citation/CitationPreview';
import { CitationSearch } from './citation/CitationSearch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
}

export const CitationManager = ({
  citations,
  onAddCitation,
  onRemoveCitation,
  onUpdateCitation
}: CitationManagerProps) => {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<'year' | 'author' | 'title'>('year');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleAddCitation = () => {
    const newCitation: Citation = {
      id: Date.now().toString(),
      text: '',
      source: '',
      authors: [''],
      year: '',
      type: 'article',
      doi: '',
      url: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      publisher: ''
    };
    onAddCitation(newCitation);
  };

  const handleSearchResult = (citation: Citation) => {
    onAddCitation(citation);
    setSearchDialogOpen(false);
  };

  const filteredAndSortedCitations = useMemo(() => {
    console.log('Filtering and sorting citations:', {
      total: citations.length,
      filterType,
      sortField,
      sortDirection
    });

    let filtered = citations;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(citation => citation.type === filterType);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(citation => 
        citation.text.toLowerCase().includes(searchLower) ||
        citation.authors.some(author => author.toLowerCase().includes(searchLower)) ||
        citation.journal?.toLowerCase().includes(searchLower) ||
        citation.year.includes(searchTerm)
      );
    }

    // Sort citations
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'year':
          comparison = (b.year || '').localeCompare(a.year || '');
          break;
        case 'author':
          comparison = (a.authors[0] || '').localeCompare(b.authors[0] || '');
          break;
        case 'title':
          comparison = a.text.localeCompare(b.text);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [citations, filterType, searchTerm, sortField, sortDirection]);

  const citationStats = useMemo(() => {
    return {
      total: citations.length,
      articles: citations.filter(c => c.type === 'article').length,
      books: citations.filter(c => c.type === 'book').length,
      others: citations.filter(c => !['article', 'book'].includes(c.type)).length
    };
  }, [citations]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-medium text-primary">Citations</h3>
          <p className="text-sm text-muted-foreground">
            {citationStats.total} citations ({citationStats.articles} articles, {citationStats.books} books, {citationStats.others} others)
          </p>
        </div>
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

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search citations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="book">Books</SelectItem>
            <SelectItem value="conference">Conference Papers</SelectItem>
            <SelectItem value="website">Websites</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortField('year')}>
              Year {sortField === 'year' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortField('author')}>
              Author {sortField === 'author' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortField('title')}>
              Title {sortField === 'title' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAndSortedCitations.map((citation) => (
          <CitationCard
            key={citation.id}
            citation={citation}
            onRemove={onRemoveCitation}
            onUpdate={onUpdateCitation}
            onPreview={() => setSelectedCitation(citation)}
          />
        ))}
        {filteredAndSortedCitations.length === 0 && (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No citations found. Try adjusting your filters or add a new citation.
          </div>
        )}
      </div>

      <Dialog open={!!selectedCitation} onOpenChange={() => setSelectedCitation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Citation Preview</DialogTitle>
          </DialogHeader>
          {selectedCitation && (
            <CitationPreview citation={selectedCitation} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};