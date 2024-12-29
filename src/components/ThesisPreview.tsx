import React from 'react';
import { Thesis } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface ThesisPreviewProps {
    thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
    const titleSection = thesis.frontMatter.find(section => section.type === 'title');
    
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

    const renderSection = (section: any, chapterTitle?: string) => {
        if (section.type === 'title') {
            return renderTitlePage();
        }
        
        return (
            <div key={section.id} className={`thesis-page ${section.type === 'references' ? 'no-footer' : ''} ${section.type === 'table-of-contents' ? 'no-header': ''}`}>
                <div className="thesis-header">
                    {chapterTitle ? `Chapter ${chapterTitle} - ${section.title}` : section.title}
                </div>
                <div className={`thesis-content ${section.type === 'abstract' ? 'thesis-abstract' : ''} ${section.type === 'references' ? 'thesis-references': ''}`}>
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
                    {section.type !== 'references' && <span>Page <span className="page-number"></span></span>}
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