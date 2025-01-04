import React from 'react';
import { Thesis, Section, ThesisSectionType } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ThesisPreviewProps {
    thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
    console.log('Rendering ThesisPreview with data:', thesis);

    const titleSection = thesis.frontMatter.find(section => section.type === 'title');
    const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');
    
    const renderTitlePage = () => {
        console.log('Rendering Title Page with data:', thesis.metadata);
        return (
            <div className="thesis-page title-page">
                <div className="thesis-title-content">
                    <div className="university-name">{thesis.metadata?.universityName || "Your University Name"}</div>
                    <div className="department-name">{thesis.metadata?.departmentName || "Department of Your Field"}</div>
                    <div className="thesis-main-title">
                        {titleSection?.content || "Untitled Thesis"}
                    </div>
                    <div className="thesis-subtitle">
                        A thesis submitted in partial fulfillment<br />
                        of the requirements for the degree of<br />
                        Doctor of Philosophy
                    </div>
                    <div className="thesis-author">
                        by<br />
                        {thesis.metadata?.authorName || "Author Name"}
                    </div>
                    <div className="thesis-date">
                         {thesis.metadata?.thesisDate || "Month Year"}
                    </div>
                    <div className="thesis-committee">
                        Thesis Committee:<br />
                        {thesis.metadata?.committeeMembers?.map((member, index) => (
                          <React.Fragment key={index}>
                            {member}
                            <br />
                          </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderFigures = (figures: Section['figures']) => {
        return figures.map((figure, index) => (
            <figure key={figure.id} className="my-8 text-center">
                <img 
                    src={figure.imageUrl} 
                    alt={figure.altText}
                    className="mx-auto max-w-full h-auto"
                />
                <figcaption className="mt-2 text-sm text-gray-600">
                    Figure {figure.number}: {figure.caption}
                </figcaption>
            </figure>
        ));
    };

    const renderTables = (tables: Section['tables']) => {
        return tables.map((table, index) => (
            <div key={table.id} className="my-8">
                <div className="overflow-x-auto">
                    <div dangerouslySetInnerHTML={{ __html: table.content }} />
                </div>
                {table.caption && (
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Table {index + 1}: {table.caption}
                    </p>
                )}
            </div>
        ));
    };

    const renderCitations = (citations: Section['citations']) => {
        return citations.map((citation) => (
            <div key={citation.id} className="citation-reference text-sm">
                {citation.authors.join(', ')} ({citation.year}). {citation.text}.
                {citation.journal && ` ${citation.journal}.`}
                {citation.doi && ` DOI: ${citation.doi}`}
            </div>
        ));
    };

    const renderAbstract = () => {
        return (
            <div className="thesis-page">
                <div className="thesis-header">
                    Abstract
                </div>
                <div className="thesis-content thesis-abstract">
                    <h2 className="text-2xl font-serif mb-4">Abstract</h2>
                    <MDEditor.Markdown 
                        source={abstractSection?.content || "No Abstract Provided"}
                        className="prose prose-sm max-w-none"
                    />
                </div>
                <div className="thesis-footer">
                    <span>Page <span className="page-number"></span></span>
                </div>
            </div>
        );
    };

    const renderSection = (section: Section, chapterTitle?: string) => {
        if (section.type === 'title') {
            return renderTitlePage();
        }
        if (section.type === 'abstract') {
            return renderAbstract();
        }

        const isSpecialSection = section.type === 'references' || section.type === 'table-of-contents';
        
        return (
            <div key={section.id} className={cn(
                "thesis-page",
                isSpecialSection && "special-section",
                section.type === 'table-of-contents' && "toc-section"
            )}>
                <div className="thesis-header">
                    {chapterTitle ? `Chapter ${chapterTitle} - ${section.title}` : section.title}
                </div>
                <div className={cn(
                    "thesis-content",
                    section.type === 'references' && "thesis-references",
                    "prose prose-sm max-w-none"
                )}>
                    {section.type !== 'table-of-contents' && (
                        <>
                            {chapterTitle && <h2 className="text-2xl font-serif mb-4">{section.title}</h2>}
                            <MDEditor.Markdown source={section.content} />
                            
                            {/* Render Figures */}
                            {section.figures && section.figures.length > 0 && (
                                <div className="figures-section">
                                    {renderFigures(section.figures)}
                                </div>
                            )}

                            {/* Render Tables */}
                            {section.tables && section.tables.length > 0 && (
                                <div className="tables-section">
                                    {renderTables(section.tables)}
                                </div>
                            )}

                            {/* Render Citations */}
                            {section.citations && section.citations.length > 0 && (
                                <div className="citations-section mt-8 border-t pt-4">
                                    <h3 className="text-lg font-serif mb-2">Citations</h3>
                                    <div className="space-y-2">
                                        {renderCitations(section.citations)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {section.type === 'table-of-contents' && (
                        <div className="toc-content">
                            <h2 className="text-2xl font-serif mb-4">Table of Contents</h2>
                            {/* TOC content will be generated automatically */}
                        </div>
                    )}
                </div>
                <div className="thesis-footer">
                    {!isSpecialSection && <span>Page <span className="page-number"></span></span>}
                </div>
            </div>
        );
    };

    return (
        <ScrollArea className="h-full">
            <div className="thesis-preview-container">
                <div className="thesis-preview">
                    {thesis.frontMatter.map((section) => renderSection(section))}
                    {thesis.chapters.map((chapter) => (
                        <div key={chapter.id} className="chapter-content">
                            {chapter.sections.map((section) => (
                                renderSection(section, chapter.title)
                            ))}
                        </div>
                    ))}
                    {thesis.backMatter.map((section) => renderSection(section))}
                </div>
            </div>
        </ScrollArea>
    );
};