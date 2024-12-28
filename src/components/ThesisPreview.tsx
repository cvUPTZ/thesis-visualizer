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
        {/* Title Page */}
        <div className="text-center mb-16 pt-16">
          <h1 className="text-3xl font-bold mb-8">{thesis.frontMatter[0].content}</h1>
          <div className="mt-16">
            <p className="text-sm text-gray-600">A thesis submitted in partial fulfillment</p>
            <p className="text-sm text-gray-600">of the requirements for the degree of</p>
            <p className="text-sm font-semibold mt-2">Doctor of Philosophy</p>
          </div>
        </div>

        {/* Abstract */}
        <div className="page-break-before">
          <h2 className="text-2xl font-bold mb-6">Abstract</h2>
          <div className="text-justify">{thesis.frontMatter[1].content}</div>
        </div>

        {/* Acknowledgments */}
        <div className="page-break-before">
          <h2 className="text-2xl font-bold mb-6">Acknowledgments</h2>
          <div className="text-justify">{thesis.frontMatter[2].content}</div>
        </div>

        {/* Table of Contents */}
        <div className="page-break-before">
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
                  <span className="text-gray-500">{thesis.frontMatter.length + chapterIndex + 1}</span>
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
        </div>

        {/* List of Figures */}
        {thesis.frontMatter.find(s => s.type === 'list-of-figures')?.figures.length > 0 && (
          <div className="page-break-before">
            <h2 className="text-2xl font-bold mb-6">List of Figures</h2>
            <div className="space-y-2">
              {thesis.frontMatter.map(section => 
                section.figures.map((figure, index) => (
                  <div key={figure.id} className="flex justify-between">
                    <span>Figure {index + 1}: {figure.caption}</span>
                    <span className="text-gray-500">{index + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* List of Tables */}
        {thesis.frontMatter.find(s => s.type === 'list-of-tables')?.tables.length > 0 && (
          <div className="page-break-before">
            <h2 className="text-2xl font-bold mb-6">List of Tables</h2>
            <div className="space-y-2">
              {thesis.frontMatter.map(section => 
                section.tables.map((table, index) => (
                  <div key={table.id} className="flex justify-between">
                    <span>Table {index + 1}: {table.caption}</span>
                    <span className="text-gray-500">{index + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chapters */}
        {thesis.chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="page-break-before">
            <h2 className="text-2xl font-bold mb-6">Chapter {chapterIndex + 1}: {chapter.title}</h2>
            {chapter.sections.map(section => (
              <div key={section.id} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <div className="text-justify">{section.content}</div>
                
                {/* Figures */}
                {section.figures.map((figure, index) => (
                  <div key={figure.id} className="my-6">
                    <img src={figure.imageUrl} alt={figure.altText} className="mx-auto max-w-full" />
                    <p className="text-center text-sm mt-2">Figure {index + 1}: {figure.caption}</p>
                  </div>
                ))}

                {/* Tables */}
                {section.tables.map((table, index) => (
                  <div key={table.id} className="my-6">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          {table.headers.map((header, i) => (
                            <th key={i} className="border border-gray-300 p-2">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-300 p-2">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-center text-sm mt-2">Table {index + 1}: {table.caption}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {/* References */}
        <div className="page-break-before">
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
        </div>

        {/* Appendices */}
        <div className="page-break-before">
          <h2 className="text-2xl font-bold mb-6">Appendices</h2>
          <div className="text-justify">{thesis.backMatter.find(s => s.type === 'appendix')?.content}</div>
        </div>
      </div>
    </ScrollArea>
  );
};