import React, { useState } from 'react';
import { Citation } from '@/types/thesis';
import { CitationSearch } from './citation/CitationSearch';
import { CitationList } from './citation/CitationList';
import { CitationPreview } from './citation/CitationPreview';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Clock } from 'lucide-react';

type CitationType = "article" | "book" | "conference" | "website" | "other" | "all";

interface CitationManagerProps {
  citations: Citation[];
  onCitationSelect?: (citation: Citation) => void;
  selectedCitation?: Citation | null;
  onCitationCreate?: (citation: Citation) => void;
  onCitationUpdate?: (citation: Citation) => void;
  onCitationDelete?: (citation: Citation) => void;
  thesisId: string;
}

export const CitationManager: React.FC<CitationManagerProps> = ({
  citations,
  onCitationSelect,
  selectedCitation,
  onCitationCreate,
  onCitationUpdate,
  onCitationDelete,
  thesisId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<CitationType>('all');
  const [sortField, setSortField] = useState<keyof Citation>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('all');

  // Filter and sort citations
  const filteredCitations = citations.filter(citation => {
    const matchesSearch = citation.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         citation.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || citation.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedCitations = [...filteredCitations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  // Type-safe handler for filter type changes
  const handleFilterTypeChange = (value: string) => {
    setFilterType(value as CitationType);
  };

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              All Citations
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <CitationList
              citations={sortedCitations}
              onSelect={onCitationSelect}
              selectedCitation={selectedCitation}
            />
          </TabsContent>

          <TabsContent value="recent">
            <CitationList
              citations={sortedCitations.slice(0, 5)}
              onSelect={onCitationSelect}
              selectedCitation={selectedCitation}
            />
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-4">
              <CitationSearch
                term={searchTerm}
                onTermChange={setSearchTerm}
                type={filterType}
                onTypeChange={handleFilterTypeChange}
                sortField={sortField}
                onSortFieldChange={setSortField}
                sortDirection={sortDirection}
                onSortDirectionChange={setSortDirection}
              />
              <CitationList
                citations={sortedCitations}
                onSelect={onCitationSelect}
                selectedCitation={selectedCitation}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {selectedCitation && (
        <CitationPreview
          citation={selectedCitation}
          onSave={onCitationUpdate}
          onRemove={onCitationDelete}
        />
      )}
    </Card>
  );
};