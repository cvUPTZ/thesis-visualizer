import React from 'react';
import { Thesis } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface ThesisPreviewProps {
  thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
  return (
    <div className="thesis-preview p-8 max-w-4xl mx-auto" data-color-mode="light">
      {thesis.frontMatter.map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-2xl font-serif mb-4">{section.title}</h2>
          <MDEditor.Markdown source={section.content} />
        </div>
      ))}
      
      {thesis.chapters.map((chapter) => (
        <div key={chapter.id} className="mb-12">
          <h2 className="text-3xl font-serif mb-6">{chapter.title}</h2>
          {chapter.sections.map((section) => (
            <div key={section.id} className="mb-8">
              <h3 className="text-xl font-serif mb-4">{section.title}</h3>
              <MDEditor.Markdown source={section.content} />
            </div>
          ))}
        </div>
      ))}

      {thesis.backMatter.map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-2xl font-serif mb-4">{section.title}</h2>
          <MDEditor.Markdown source={section.content} />
        </div>
      ))}
    </div>
  );
};