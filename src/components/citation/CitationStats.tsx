import React from 'react';
import { Citation } from '@/types/thesis';

interface CitationStatsProps {
  citations: Citation[];
}

export const CitationStats = ({ citations }: CitationStatsProps) => {
  const stats = {
    total: citations.length,
    articles: citations.filter(c => c.type === 'article').length,
    books: citations.filter(c => c.type === 'book').length,
    others: citations.filter(c => !['article', 'book'].includes(c.type)).length
  };

  return (
    <div className="space-y-1">
      <h3 className="text-lg font-serif font-medium text-primary">Citations</h3>
      <p className="text-sm text-muted-foreground">
        {stats.total} citations ({stats.articles} articles, {stats.books} books, {stats.others} others)
      </p>
    </div>
  );
};