import React, { useMemo } from 'react';
import { Thesis, Section } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface ThesisPreviewProps {
    thesis: Thesis;
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
    console.log('Rendering ThesisPreview with data:', thesis);

    const titleSection = useMemo(() => thesis.frontMatter.find(section => section.type === 'title'), [thesis]);
    const abstractSection = useMemo(() => thesis.frontMatter.find(section => section.type === 'abstract'), [thesis]);

  const renderCommitteeMembers = () => {
      if (!thesis.metadata?.committeeMembers) return null;
      return (
        <div>
          Thesis Committee:<br />
            {thesis.metadata.committeeMembers?.map((member, index) => (
              <React.Fragment key={index}>
                {member}
                <br />
              </React.Fragment>
            ))}
          </div>
        );
  }

    const renderTitlePage = () => {
        console.log('Rendering Title Page with data:', thesis.metadata);
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
                    {renderCommitteeMembers()}
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
                    <MDEditor.Markdown source={thesis.metadata?.description || "No Description Provided"}/>
                </div>
            </div>
        );
    };

    const renderSectionContent = (section: Section, chapterTitle?: string) => {
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
                          {/* Render the chapter names and sections */}
                          <h2 className="text-2xl font-serif mb-4">Table of Contents</h2>
                            {thesis.chapters.map((chapter) => (
                              <div key={chapter.id} className="mb-4">
                                <h3 className="text-xl font-serif font-medium">{chapter.title}</h3>
                                 <ul className="list-disc list-inside ml-6">
                                  {chapter.sections.map((section) => (
                                      <li key={section.id}>{section.title}</li>
                                   ))}
                                </ul>
                              </div>
                           ))}
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
                {thesis.frontMatter.map((section) => renderSectionContent(section))}
                {thesis.chapters.map((chapter) => (
                    <div key={chapter.id}>
                        {chapter.sections.map((section) => (
                            renderSectionContent(section, chapter.title)
                        ))}
                    </div>
                ))}
                {thesis.backMatter.map((section) => renderSectionContent(section))}
            </div>
        </div>
    );
};