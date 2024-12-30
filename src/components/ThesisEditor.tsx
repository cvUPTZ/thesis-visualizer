import React, { useState, useRef } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { ThesisPreview } from './ThesisPreview';
import { ThesisContent } from './thesis/ThesisContent';
import { ThesisToolbar } from './thesis/ThesisToolbar';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useThesisAutosave } from '@/hooks/useThesisAutosave';
import { useThesisInitialization } from '@/hooks/useThesisInitialization';

export const ThesisEditor = () => {
  const [thesis, setThesis] = useState<Thesis>({
    id: crypto.randomUUID(),
    frontMatter: [
      {
        id: '1',
        title: 'Thesis Title',
        content: 'Enter your thesis title...',
        type: 'title',
        required: true,
        order: 1,
        figures: [],
        tables: [],
        citations: []
      },
      {
        id: '2',
        title: 'Abstract',
        content: 'A concise summary of your research...',
        type: 'abstract',
        required: true,
        order: 2,
        figures: [],
        tables: [],
        citations: []
      },
      {
        id: '3',
        title: 'Acknowledgments',
        content: 'Express gratitude to individuals and organizations who contributed to your research...',
        type: 'acknowledgments',
        required: false,
        order: 3,
        figures: [],
        tables: [],
        citations: []
      },
      {
        id: '4',
        title: 'Table of Contents',
        content: 'Automatically generated table of contents will appear here...',
        type: 'table-of-contents',
        required: true,
        order: 4,
        figures: [],
        tables: [],
        citations: []
      },
      {
        id: '5',
        title: 'List of Figures',
        content: 'Automatically generated list of figures will appear here...',
        type: 'list-of-figures',
        required: false,
        order: 5,
        figures: [],
        tables: [],
        citations: []
      },
      {
        id: '6',
        title: 'List of Tables',
        content: 'Automatically generated list of tables will appear here...',
        type: 'list-of-tables',
        required: false,
        order: 6,
        figures: [],
        tables: [],
        citations: []
      },
    ],
    chapters: [],
    backMatter: [
      {
        id: '14',
        title: 'References',
        content: 'List all cited works...',
        type: 'references',
        required: true,
        order: 14,
        figures: [],
        tables: [],
        citations: [],
        references: []
      },
      {
        id: '15',
        title: 'Appendices',
        content: 'Include supplementary materials...',
        type: 'appendix',
        required: false,
        order: 15,
        figures: [],
        tables: [],
        citations: []
      }
    ]
  });

  // Initialize thesis in database
  useThesisInitialization(thesis);

  // Initialize auto-save
  useThesisAutosave(thesis);

  const [activeSection, setActiveSection] = useState<string>(thesis.frontMatter[0].id);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (id: string, newContent: string) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      frontMatter: prevThesis.frontMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      ),
      backMatter: prevThesis.backMatter.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      )
    }));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      frontMatter: prevThesis.frontMatter.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      ),
      backMatter: prevThesis.backMatter.map(section =>
        section.id === id ? { ...section, title: newTitle } : section
      )
    }));
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: 'New Chapter',
      order: thesis.chapters.length + 1,
      sections: []
    };
    setThesis(prevThesis => ({
      ...prevThesis,
      chapters: [...prevThesis.chapters, newChapter]
    }));
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    setThesis(prevThesis => ({
      ...prevThesis,
      chapters: prevThesis.chapters.map(chapter =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      )
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <ThesisSidebar
        sections={[
          ...thesis.frontMatter,
          ...thesis.chapters.flatMap(chapter =>
            chapter.sections.map(section => ({
              ...section,
              title: `${chapter.title} - ${section.title}`
            }))
          ),
          ...thesis.backMatter
        ]}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
      />
      <main className="flex-1 p-8 flex">
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <ThesisToolbar
              thesisId={thesis.id}
              thesisData={thesis}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview(!showPreview)}
            />
            <ThesisContent
              frontMatter={thesis.frontMatter}
              chapters={thesis.chapters}
              backMatter={thesis.backMatter}
              activeSection={activeSection}
              onContentChange={handleContentChange}
              onTitleChange={handleTitleChange}
              onUpdateChapter={handleUpdateChapter}
              onAddChapter={handleAddChapter}
            />
          </div>
        </div>
        {showPreview && (
          <div className="w-1/2 pl-8 border-l">
            <div ref={previewRef}>
              <ThesisPreview thesis={thesis} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
