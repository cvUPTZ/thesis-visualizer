import React, { useState } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { EditorSection } from './EditorSection';
import { ChapterManager } from './ChapterManager';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Chapter, Section, Thesis } from '@/types/thesis';

export const ThesisEditor = () => {
  const [thesis, setThesis] = useState<Thesis>({
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
      order: 3
    },
    {
      id: '4',
      title: 'Table of Contents',
      content: 'Automatically generated table of contents will appear here...',
      type: 'table-of-contents',
      required: true,
      order: 4
    },
    {
      id: '5',
      title: 'List of Figures',
      content: 'Automatically generated list of figures will appear here...',
      type: 'list-of-figures',
      required: false,
      order: 5
    },
    {
      id: '6',
      title: 'List of Tables',
      content: 'Automatically generated list of tables will appear here...',
      type: 'list-of-tables',
      required: false,
      order: 6
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
        citations: []
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

  const [activeSection, setActiveSection] = useState<string>(thesis.frontMatter[0].id);

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
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-serif text-primary">Thesis Editor</h1>
          </div>
          <div className="space-y-6">
            {thesis.frontMatter.map(section => (
              <EditorSection
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                onContentChange={handleContentChange}
                onTitleChange={handleTitleChange}
              />
            ))}
            <ChapterManager
              chapters={thesis.chapters}
              onUpdateChapter={handleUpdateChapter}
              onAddChapter={handleAddChapter}
            />
            {thesis.backMatter.map(section => (
              <EditorSection
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                onContentChange={handleContentChange}
                onTitleChange={handleTitleChange}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
