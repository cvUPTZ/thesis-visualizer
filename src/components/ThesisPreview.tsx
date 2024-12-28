import React from 'react';
import { Thesis } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThesisPreviewProps {
  thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-2rem)] pr-6">
      <div className="thesis-content space-y-8">
        {/* Title Page - No header/footer */}
        <div className="thesis-page no-header no-footer">
          <div className="text-center mb-16 pt-16">
            <h1 className="text-3xl font-bold mb-8">{thesis.frontMatter[0].content}</h1>
            <div className="mt-16">
              <p className="text-sm text-gray-600">A thesis submitted in partial fulfillment</p>
              <p className="text-sm text-gray-600">of the requirements for the degree of</p>
              <p className="text-sm font-semibold mt-2">Doctor of Philosophy</p>
            </div>
          </div>
        </div>

        {/* Abstract */}
        <div className="thesis-page">
          <div className="thesis-header">
            {thesis.frontMatter[0].content}
          </div>
          <h2 className="text-2xl font-bold mb-6">Abstract</h2>
          <div className="text-justify">{thesis.frontMatter[1].content}</div>
          <div className="thesis-footer">
            Department of Computer Science
          </div>
        </div>

        {/* Acknowledgments */}
        <div className="thesis-page">
          <div className="thesis-header">
            {thesis.frontMatter[0].content}
          </div>
          <h2 className="text-2xl font-bold mb-6">Acknowledgments</h2>
          <div className="text-justify">{thesis.frontMatter[2].content}</div>
          <div className="thesis-footer">
            Department of Computer Science
          </div>
        </div>

        {/* Table of Contents */}
        <div className="thesis-page">
          <div className="thesis-header">
            {thesis.frontMatter[0].content}
          </div>
          <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
          <div className="space-y-2">
            {thesis.frontMatter.map((section, index) => (
              <div key={section.id} className="flex justify-between">
                <span>{section.title}</span>
                <span className="text-gray-500">{index + 1}</span>
              </div>
            ))}
            {thesis.chapters.map((chapter, chapterIndex) => (
              <React.Fragment key={chapter.id}>
                <div className="flex justify-between font-semibold">
                  <span>Chapter {chapterIndex + 1}: {chapter.title}</span>
                  <span className="text-gray-500">
                    {thesis.frontMatter.length + chapterIndex + 1}
                  </span>
                </div>
                {chapter.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="flex justify-between pl-4">
                    <span>{section.title}</span>
                    <span className="text-gray-500">{sectionIndex + 1}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="thesis-footer">
            Department of Computer Science
          </div>
        </div>

        {/* Chapters */}
        {thesis.chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="thesis-page">
            <div className="thesis-header">
              Chapter {chapterIndex + 1}: {chapter.title}
            </div>
            <h2 className="text-2xl font-bold mb-6">
              Chapter {chapterIndex + 1}: {chapter.title}
            </h2>
            {chapter.sections.map(section => (
              <div key={section.id} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <div className="text-justify">{section.content}</div>
                
                {/* Figures */}
                {section.figures.map((figure, index) => (
                  <div key={figure.id} className="my-6">
                    <img 
                      src={figure.imageUrl} 
                      alt={figure.altText} 
                      className="mx-auto max-w-full" 
                    />
                    <p className="text-center text-sm mt-2">
                      Figure {chapterIndex + 1}.{index + 1}: {figure.caption}
                    </p>
                  </div>
                ))}

                {/* Tables */}
                {section.tables.map((table, index) => (
                  <div key={table.id} className="my-6">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          {table.headers.map((header, i) => (
                            <th key={i} className="border border-gray-300 p-2">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-300 p-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-center text-sm mt-2">
                      Table {chapterIndex + 1}.{index + 1}: {table.caption}
                    </p>
                  </div>
                ))}
              </div>
            ))}
            <div className="thesis-footer">
              Department of Computer Science
            </div>
          </div>
        ))}

        {/* References */}
        <div className="thesis-page">
          <div className="thesis-header">
            References
          </div>
          <h2 className="text-2xl font-bold mb-6">References</h2>
          <div className="space-y-4">
            {thesis.backMatter.find(s => s.type === 'references')?.references?.map((reference, index) => (
              <div key={reference.id} className="text-justify">
                {reference.authors.join(', ')} ({reference.year}). {reference.title}.
                {reference.journal && <em> {reference.journal}</em>}
                {reference.volume && `, ${reference.volume}`}
                {reference.issue && `(${reference.issue})`}
                {reference.pages && `, ${reference.pages}`}.
                {reference.doi && <span className="text-blue-600"> DOI: {reference.doi}</span>}
              </div>
            ))}
          </div>
          <div className="thesis-footer">
            Department of Computer Science
          </div>
        </div>

        {/* Appendices */}
        <div className="thesis-page">
          <div className="thesis-header">
            Appendices
          </div>
          <h2 className="text-2xl font-bold mb-6">Appendices</h2>
          <div className="text-justify">
            {thesis.backMatter.find(s => s.type === 'appendix')?.content}
          </div>
          <div className="thesis-footer">
            Department of Computer Science
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};