import React from 'react';
import { CitationManager } from '@/components/CitationManager';
import { ReferenceManager } from '@/components/ReferenceManager';

const BibliographyPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold">Bibliography</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Citations</h2>
          <CitationManager
            citations={[]}
            onCitationCreate={() => {}}
            onCitationUpdate={() => {}}
            onCitationDelete={() => {}}
            thesisId=""
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">References</h2>
          <ReferenceManager
            items={[]}
            onAdd={() => {}}
            onRemove={() => {}}
            onUpdate={() => {}}
          />
        </section>
      </div>
    </div>
  );
};

export default BibliographyPage;