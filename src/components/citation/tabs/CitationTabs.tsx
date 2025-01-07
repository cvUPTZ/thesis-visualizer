import React from 'react';
import { Citation } from '@/types/thesis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Clock } from 'lucide-react';
import { AllCitationsTab } from './AllCitationsTab';
import { SearchCitationsTab } from './SearchCitationsTab';
import { RecentCitationsTab } from './RecentCitationsTab';

interface CitationTabsProps {
  citations: Citation[];
  filteredCitations: Citation[];
  searchTerm: string;
  filterType: string;
  sortField: 'year' | 'author' | 'title';
  sortDirection: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSortFieldChange: (field: 'year' | 'author' | 'title') => void;
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview: (citation: Citation | null) => void;
}

export const CitationTabs = ({
  citations,
  filteredCitations,
  searchTerm,
  filterType,
  sortField,
  sortDirection,
  onSearchChange,
  onFilterChange,
  onSortFieldChange,
  onSortDirectionChange,
  onRemove,
  onUpdate,
  onPreview
}: CitationTabsProps) => {
  const recentCitations = React.useMemo(() => 
    [...citations]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
    [citations]
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          All Citations
        </TabsTrigger>
        <TabsTrigger value="search" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search & Filter
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <AllCitationsTab
          citations={citations}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onPreview={onPreview}
        />
      </TabsContent>

      <TabsContent value="search">
        <SearchCitationsTab
          citations={filteredCitations}
          searchTerm={searchTerm}
          filterType={filterType}
          sortField={sortField}
          sortDirection={sortDirection}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onSortFieldChange={onSortFieldChange}
          onSortDirectionChange={onSortDirectionChange}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onPreview={onPreview}
        />
      </TabsContent>

      <TabsContent value="recent">
        <RecentCitationsTab
          citations={recentCitations}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onPreview={onPreview}
        />
      </TabsContent>
    </Tabs>
  );
};