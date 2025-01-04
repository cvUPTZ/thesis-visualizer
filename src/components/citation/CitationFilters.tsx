import React from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface CitationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  sortField: 'year' | 'author' | 'title';
  onSortFieldChange: (field: 'year' | 'author' | 'title') => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
}

export const CitationFilters = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange
}: CitationFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <Input
          placeholder="Search citations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>
      <Select value={filterType} onValueChange={onFilterChange}>
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
          <DropdownMenuItem onClick={() => onSortFieldChange('year')}>
            Year {sortField === 'year' && '✓'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortFieldChange('author')}>
            Author {sortField === 'author' && '✓'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortFieldChange('title')}>
            Title {sortField === 'title' && '✓'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}>
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};