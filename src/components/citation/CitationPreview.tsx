import React from 'react';
import { Citation } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface CitationPreviewProps {
  citation: Citation;
  onEdit?: (citation: Citation) => void;
  onDelete?: (citation: Citation) => void;
  onClose?: () => void;
}

export const CitationPreview: React.FC<CitationPreviewProps> = ({ 
  citation,
  onEdit,
  onDelete,
  onClose
}) => {
  const formatAPA = () => {
    const authors = citation.authors
      .map((author, index) => {
        const names = author.split(' ');
        const lastName = names.pop();
        const initials = names.map(name => `${name[0]}.`).join(' ');
        return index === citation.authors.length - 1
          ? `${lastName}, ${initials}`
          : `${lastName}, ${initials},`;
      })
      .join(' ');

    let result = `${authors} (${citation.year}). ${citation.text}`;

    if (citation.type === 'article' && citation.journal) {
      result += `. ${citation.journal}`;
      if (citation.volume) result += `, ${citation.volume}`;
      if (citation.issue) result += `(${citation.issue})`;
      if (citation.pages) result += `, ${citation.pages}`;
    } else if (citation.type === 'book' && citation.publisher) {
      result += `. ${citation.publisher}`;
    }

    if (citation.doi) result += `. https://doi.org/${citation.doi}`;
    return result;
  };

  const formatMLA = () => {
    const authors = citation.authors
      .map((author, index) => {
        const names = author.split(' ');
        const lastName = names.pop();
        const firstName = names.join(' ');
        return index === 0
          ? `${lastName}, ${firstName}`
          : `${firstName} ${lastName}`;
      })
      .join(', ');

    let result = `${authors}. "${citation.text}." `;

    if (citation.type === 'article' && citation.journal) {
      result += `${citation.journal}`;
      if (citation.volume) result += ` ${citation.volume}`;
      if (citation.issue) result += `.${citation.issue}`;
      if (citation.year) result += ` (${citation.year})`;
      if (citation.pages) result += `: ${citation.pages}`;
    } else if (citation.type === 'book' && citation.publisher) {
      result += `${citation.publisher}, ${citation.year}`;
    }

    return result;
  };

  const formatChicago = () => {
    const authors = citation.authors
      .map((author, index) => {
        const names = author.split(' ');
        const lastName = names.pop();
        const firstName = names.join(' ');
        return index === 0
          ? `${lastName}, ${firstName}`
          : `${firstName} ${lastName}`;
      })
      .join(', ');

    let result = `${authors}. `;

    if (citation.type === 'article' && citation.journal) {
      result += `"${citation.text}." ${citation.journal}`;
      if (citation.volume) result += ` ${citation.volume}`;
      if (citation.issue) result += `, no. ${citation.issue}`;
      if (citation.year) result += ` (${citation.year})`;
      if (citation.pages) result += `: ${citation.pages}`;
    } else if (citation.type === 'book' && citation.publisher) {
      result += `${citation.text}. ${citation.publisher}, ${citation.year}`;
    }

    return result;
  };

  return (
    <Tabs defaultValue="apa" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="apa">APA</TabsTrigger>
        <TabsTrigger value="mla">MLA</TabsTrigger>
        <TabsTrigger value="chicago">Chicago</TabsTrigger>
      </TabsList>
      <TabsContent value="apa">
        <Card className="p-4">
          <p className="text-sm">{formatAPA()}</p>
        </Card>
      </TabsContent>
      <TabsContent value="mla">
        <Card className="p-4">
          <p className="text-sm">{formatMLA()}</p>
        </Card>
      </TabsContent>
      <TabsContent value="chicago">
        <Card className="p-4">
          <p className="text-sm">{formatChicago()}</p>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
