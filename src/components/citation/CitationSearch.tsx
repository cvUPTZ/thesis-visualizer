import React from 'react';
import { Citation, CitationType } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface CitationSearchProps {
  onCitationSelect: (citation: Omit<Citation, "thesis_id">) => void;
}

export const CitationSearch: React.FC<CitationSearchProps> = ({ onCitationSelect }) => {
  const [query, setQuery] = React.useState('');
  const { toast } = useToast();

  const searchCitations = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.message?.items?.length > 0) {
        const citation = formatCitation(data.message.items[0]);
        onCitationSelect(citation);
        setQuery('');
      } else {
        toast({
          title: "No Results",
          description: "No citations found for your search query.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching citations:', error);
      toast({
        title: "Error",
        description: "Failed to search citations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCitation = (result: any): Omit<Citation, "thesis_id"> => {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      reference_id: '',
      text: result.title?.[0] || '',
      source: result.publisher || '',
      authors: result.author?.map((a: any) => `${a.given} ${a.family}`) || [],
      year: result.published?.['date-parts']?.[0]?.[0]?.toString() || '',
      type: CitationType.ARTICLE,
      doi: result.DOI,
      url: result.URL,
      journal: result['container-title']?.[0],
      volume: result.volume,
      issue: result.issue,
      pages: result.page,
      publisher: result.publisher,
      created_at: now,
      updated_at: now
    };
  };

  return (
    <form onSubmit={searchCitations} className="flex gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for citations..."
        className="flex-1"
      />
      <Button type="submit" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};