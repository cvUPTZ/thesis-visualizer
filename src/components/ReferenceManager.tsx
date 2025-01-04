import React, { useState } from 'react';
import { Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X, BookOpen, Link, Search, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ReferenceManagerProps {
  references: Reference[];
  onAddReference: (reference: Reference) => void;
  onRemoveReference: (id: string) => void;
  onUpdateReference: (reference: Reference) => void;
}

export const ReferenceManager = ({
  references,
  onAddReference,
  onRemoveReference,
  onUpdateReference
}: ReferenceManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'doi' | 'isbn'>('doi');
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);

  const handleAddReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      title: '',
      authors: [''],
      year: '',
      type: 'article'
    };
    onAddReference(newReference);
  };

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['reference', searchTerm, searchType],
    queryFn: async () => {
      if (!searchTerm) return null;
      
      // Example API call - replace with actual API
      const response = await fetch(
        searchType === 'doi'
          ? `https://api.crossref.org/works/${searchTerm}`
          : `https://openlibrary.org/api/books?bibkeys=ISBN:${searchTerm}&format=json&jscmd=data`
      );
      
      if (!response.ok) throw new Error('Failed to fetch reference');
      
      return response.json();
    },
    enabled: false
  });

  const handleSearch = () => {
    if (searchTerm) {
      refetch();
    }
  };

  const exportReferences = (format: 'bibtex' | 'ris') => {
    let content = '';
    
    if (format === 'bibtex') {
      content = references.map(ref => {
        return `@${ref.type}{${ref.id},
  title = {${ref.title}},
  author = {${ref.authors.join(' and ')}},
  year = {${ref.year}}${ref.journal ? `,
  journal = {${ref.journal}}` : ''}${ref.doi ? `,
  doi = {${ref.doi}}` : ''}
}`;
      }).join('\n\n');
    } else {
      content = references.map(ref => {
        return `TY  - ${ref.type.toUpperCase()}
TI  - ${ref.title}
${ref.authors.map(author => `AU  - ${author}`).join('\n')}
PY  - ${ref.year}${ref.journal ? `
JO  - ${ref.journal}` : ''}${ref.doi ? `
DO  - ${ref.doi}` : ''}
ER  -`;
      }).join('\n\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `references.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">References</h3>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search References</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Enter ${searchType.toUpperCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setSearchType(searchType === 'doi' ? 'isbn' : 'doi')}
                  >
                    Search by {searchType === 'doi' ? 'ISBN' : 'DOI'}
                  </Button>
                  <Button onClick={handleSearch}>Search</Button>
                </div>
                {searchResults && (
                  <div className="space-y-2">
                    {/* Render search results */}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReferences('bibtex')}
          >
            <Download className="w-4 h-4 mr-2" />
            BibTeX
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReferences('ris')}
          >
            <Download className="w-4 h-4 mr-2" />
            RIS
          </Button>
          <Button onClick={handleAddReference} variant="outline" size="sm" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Reference
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {references.map((reference) => (
          <Card key={reference.id} className="border-2 border-editor-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {reference.type === 'book' ? (
                  <BookOpen className="w-4 h-4 inline mr-2" />
                ) : (
                  <Link className="w-4 h-4 inline mr-2" />
                )}
                {reference.type.charAt(0).toUpperCase() + reference.type.slice(1)}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveReference(reference.id)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={reference.type}
                onValueChange={(value: any) =>
                  onUpdateReference({ ...reference, type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="thesis">Thesis</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Title"
                value={reference.title}
                onChange={(e) =>
                  onUpdateReference({ ...reference, title: e.target.value })
                }
                className="mb-2"
              />
              <Input
                placeholder="Authors (comma-separated)"
                value={reference.authors.join(', ')}
                onChange={(e) =>
                  onUpdateReference({
                    ...reference,
                    authors: e.target.value.split(',').map((a) => a.trim())
                  })
                }
                className="mb-2"
              />
              <Input
                placeholder="Year"
                value={reference.year}
                onChange={(e) =>
                  onUpdateReference({ ...reference, year: e.target.value })
                }
                className="mb-2"
              />
              <Input
                placeholder="DOI"
                value={reference.doi}
                onChange={(e) =>
                  onUpdateReference({ ...reference, doi: e.target.value })
                }
                className="mb-2"
              />
              {reference.type === 'article' && (
                <>
                  <Input
                    placeholder="Journal"
                    value={reference.journal}
                    onChange={(e) =>
                      onUpdateReference({ ...reference, journal: e.target.value })
                    }
                    className="mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Volume"
                      value={reference.volume}
                      onChange={(e) =>
                        onUpdateReference({ ...reference, volume: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Issue"
                      value={reference.issue}
                      onChange={(e) =>
                        onUpdateReference({ ...reference, issue: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Pages"
                      value={reference.pages}
                      onChange={(e) =>
                        onUpdateReference({ ...reference, pages: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
              {reference.type === 'book' && (
                <Input
                  placeholder="Publisher"
                  value={reference.publisher}
                  onChange={(e) =>
                    onUpdateReference({ ...reference, publisher: e.target.value })
                  }
                />
              )}
              {(reference.type === 'website' || reference.type === 'other') && (
                <Input
                  placeholder="URL"
                  value={reference.url}
                  onChange={(e) =>
                    onUpdateReference({ ...reference, url: e.target.value })
                  }
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};