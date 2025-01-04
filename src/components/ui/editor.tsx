import React from 'react';
import { EditorSection } from '@/components/editor/section/EditorSection';

interface EditorProps {
  thesisId?: string;
}

export const Editor = ({ thesisId }: EditorProps) => {
  return (
    <div className="p-4">
      <EditorSection>
        <div className="prose prose-sm max-w-none">
          <h2>Editor Content</h2>
          <p>Content for thesis {thesisId}</p>
        </div>
      </EditorSection>
    </div>
  );
};