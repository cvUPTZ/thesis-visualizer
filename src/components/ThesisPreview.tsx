import React from 'react';
import { Thesis } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface ThesisPreviewProps {
  thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
    const renderSection = (section: any, chapterTitle?: string) => {
        return (
          <div key={section.id} className={`thesis-page ${section.type === 'references' ? 'no-footer' : ''}`}>
            <div className="thesis-header">
              {chapterTitle ? `Chapter ${chapterTitle} - ${section.title}` : section.title}
            </div>
            <div className="thesis-content">
                {section.type !== 'table-of-contents' && (
                   <>
                   {chapterTitle && <h2 className="text-2xl font-serif mb-4">{section.title}</h2>}
                     <MDEditor.Markdown source={section.content} />
                   </>
                )}
                {section.type === 'table-of-contents' && (
                  <>
                  </>
                )}
              
            </div>
             <div className="thesis-footer">
              {section.type !== 'references' && 'Page'}
             </div>
          </div>
        );
      };


  return (
    <div className="thesis-preview">
        {thesis.frontMatter.map((section) => (
          renderSection(section)
        ))}
         {thesis.chapters.map((chapter) => (
        <div key={chapter.id}>
          {chapter.sections.map((section) => (
            renderSection(section, chapter.title)
           ))}
        </div>
      ))}
      {thesis.backMatter.map((section) => (
         renderSection(section)
      ))}
    </div>
  );
};