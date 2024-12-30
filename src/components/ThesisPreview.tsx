// File: src/components/ThesisPreview.tsx

import React from 'react';
import { Thesis, Section, ThesisSectionType } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface ThesisPreviewProps {
    thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
    console.log('Rendering ThesisPreview with data:', thesis);

    const titleSection = thesis.frontMatter.find(section => section.type === 'title');
    const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');
    
     const renderTitlePage = () => {
        return (
            <div className="thesis-page no-header no-footer">
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
                        ))
                        }
                    </div>
                </div>
            </div>
        );
    };


    const renderAbstract = () => {
        return (
            <div className="thesis-page no-footer">
                <div className="thesis-header">
                    Abstract
                </div>
                <div className="thesis-content thesis-abstract">
                    <h2 className="text-2xl font-serif mb-4">Abstract</h2>
                    <MDEditor.Markdown source={thesis.metadata.description || "No Description Provided"}/>
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
            <div key={section.id} className={`thesis-page ${isSpecialSection ? 'no-footer' : ''} ${section.type === 'table-of-contents' ? 'no-header': ''}`}>
                <div className="thesis-header">
                    {chapterTitle ? `Chapter ${chapterTitle} - ${section.title}` : section.title}
                </div>
                <div className={`thesis-content ${section.type === 'references' ? 'thesis-references': ''}`}>
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
                    {!isSpecialSection && <span>Page <span className="page-number"></span></span>}
                </div>
            </div>
        );
    };

    return (
        <div className="thesis-preview-scroll-container">
            <div className="thesis-preview">
                {thesis.frontMatter.map((section) => renderSection(section))}
                {thesis.chapters.map((chapter) => (
                    <div key={chapter.id}>
                        {chapter.sections.map((section) => (
                            renderSection(section, chapter.title)
                        ))}
                    </div>
                ))}
                {thesis.backMatter.map((section) => renderSection(section))}
            </div>
        </div>
    );
};