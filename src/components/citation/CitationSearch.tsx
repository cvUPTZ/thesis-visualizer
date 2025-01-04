import React, { useState } from 'react';
import { Citation } from '@/types/thesis';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CitationSearchProps {
  onSelect: (citation: Citation) => void;
}

export const CitationSearch = ({ onSelect }: CitationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'doi' | 'title'>('doi');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['citation', searchTerm, searchType],
    queryFn: async () => {
      if (!searchTerm) return null;
      
      // Example API call - replace with actual citation API
      const response = await fetch(
        searchType === 'doi'
          ? `https://api.crossref.org/works/${searchTerm}`
          : `https://api.crossref.org/works?query=${searchTerm}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch citation');
      
      const data = await response.json();
      return data;
    },
    enabled: false
  });

  const handleSearch = () => {
    if (searchTerm) {
      refetch();
    }
  };

  const formatCitation = (result: any): Omit<Citation, 'thesis_id'> => {
    // Format the API response into a Citation object without thesis_id
    return {
      id: crypto.randomUUID(),
      text: result.title[0],
      source: result.publisher,
      authors: result.author?.map((a: any) => `${a.given} ${a.family}`) || [''],
      year: result.published?.['date-parts']?.[0]?.[0]?.toString() || '',
      type: result.type === 'journal-article' ? 'article' : 'book',
      doi: result.DOI,
      journal: result['container-title']?.[0],
      volume: result.volume,
      issue: result.issue,
      pages: result.page,
      publisher: result.publisher
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder={searchType === 'doi' ? 'Enter DOI...' : 'Search by title...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => setSearchType(searchType === 'doi' ? 'title' : 'doi')}
        >
          Search by {searchType === 'doi' ? 'Title' : 'DOI'}
        </Button>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Search
        </Button>
      </div>

      {data?.message && (
        <div className="space-y-2">
          <h4 className="font-medium">Search Results</h4>
          {Array.isArray(data.message.items) ? (
            data.message.items.map((item: any) => (
              <div
                key={item.DOI}
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => onSelect(formatCitation(item))}
              >
                <p className="font-medium">{item.title?.[0]}</p>
                <p className="text-sm text-muted-foreground">
                  {item.author?.map((a: any) => `${a.given} ${a.family}`).join(', ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item['container-title']?.[0]} ({item.published?.['date-parts']?.[0]?.[0]})
                </p>
              </div>
            ))
          ) : (
            <div
              className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => onSelect(formatCitation(data.message))}
            >
              <p className="font-medium">{data.message.title?.[0]}</p>
              <p className="text-sm text-muted-foreground">
                {data.message.author?.map((a: any) => `${a.given} ${a.family}`).join(', ')}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.message['container-title']?.[0]} ({data.message.published?.['date-parts']?.[0]?.[0]})
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};