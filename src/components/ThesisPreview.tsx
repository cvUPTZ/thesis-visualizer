import React, { useRef } from 'react';
import { Thesis, Section, ThesisSectionType } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface ThesisPreviewProps {
    thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
    const titleSection = thesis.frontMatter.find(section => section.type === 'title');
    const previewRef = useRef<HTMLDivElement>(null);

    const renderTitlePage = () => {
        return (
            <div className="thesis-page no-header no-footer">
                <div className="thesis-title-content">
                    <div className="university-name">Your University Name</div>
                    <div className="department-name">Department of Your Field</div>
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
                        Author Name
                    </div>
                    <div className="thesis-date">
                        Month Year
                    </div>
                    <div className="thesis-committee">
                        Thesis Committee:<br />
                        Professor Name, Chair<br />
                        Professor Name<br />
                        Professor Name
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
        <div className="thesis-preview-scroll-container h-full">
            <div className="thesis-preview" ref={previewRef}>
                {thesis.frontMatter.map((section) => (
                  <React.Fragment key={section.id}>
                    {renderSection(section)}
                  </React.Fragment>
                 ))}
                {thesis.chapters.map((chapter) => (
                    <div key={chapter.id}>
                        {chapter.sections.map((section) => (
                            <React.Fragment key={section.id}>
                              {renderSection(section, chapter.title)}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
                 {thesis.backMatter.map((section) => (
                  <React.Fragment key={section.id}>
                    {renderSection(section)}
                  </React.Fragment>
                ))}
            </div>
        </div>
    );
};