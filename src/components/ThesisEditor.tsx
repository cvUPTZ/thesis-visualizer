import React, { useState } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { EditorSection } from './EditorSection';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export interface Section {
  id: string;
  title: string;
  content: string;
  type: 
    | 'title' 
    | 'abstract' 
    | 'acknowledgments'
    | 'table-of-contents'
    | 'list-of-figures'
    | 'list-of-tables'
    | 'introduction'
    | 'literature-review'
    | 'methodology'
    | 'results'
    | 'discussion'
    | 'conclusion'
    | 'recommendations'
    | 'references'
    | 'appendix'
    | 'custom';
  required?: boolean;
  order: number;
}

export const ThesisEditor = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Thesis Title',
      content: 'Enter your thesis title...',
      type: 'title',
      required: true,
      order: 1
    },
    {
      id: '2',
      title: 'Abstract',
      content: 'A concise summary of your research, including the problem statement, methodology, key findings, and conclusions...',
      type: 'abstract',
      required: true,
      order: 2
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
    {
      id: '7',
      title: 'Introduction',
      content: 'Introduce your research topic, including background information, problem statement, research objectives, and significance of the study...',
      type: 'introduction',
      required: true,
      order: 7
    },
    {
      id: '8',
      title: 'Literature Review',
      content: 'Review and analyze relevant literature, theories, and previous research related to your topic...',
      type: 'literature-review',
      required: true,
      order: 8
    },
    {
      id: '9',
      title: 'Methodology',
      content: 'Describe your research design, data collection methods, analysis techniques, and any ethical considerations...',
      type: 'methodology',
      required: true,
      order: 9
    },
    {
      id: '10',
      title: 'Results',
      content: 'Present your research findings, including data analysis, statistical tests, and visual representations...',
      type: 'results',
      required: true,
      order: 10
    },
    {
      id: '11',
      title: 'Discussion',
      content: 'Interpret your results, compare them with previous research, and discuss their implications...',
      type: 'discussion',
      required: true,
      order: 11
    },
    {
      id: '12',
      title: 'Conclusion',
      content: 'Summarize key findings, address research objectives, discuss limitations, and suggest future research directions...',
      type: 'conclusion',
      required: true,
      order: 12
    },
    {
      id: '13',
      title: 'Recommendations',
      content: 'Provide specific recommendations based on your research findings...',
      type: 'recommendations',
      required: false,
      order: 13
    },
    {
      id: '14',
      title: 'References',
      content: 'List all cited works following the required citation style...',
      type: 'references',
      required: true,
      order: 14
    },
    {
      id: '15',
      title: 'Appendices',
      content: 'Include supplementary materials, raw data, or additional information...',
      type: 'appendix',
      required: false,
      order: 15
    }
  ]);

  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  const handleContentChange = (id: string, newContent: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content: newContent } : section
    ));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, title: newTitle } : section
    ));
  };

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      type: 'custom',
      required: false,
      order: sections.length + 1
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <ThesisSidebar 
        sections={sections}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
      />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-serif text-primary">Thesis Editor</h1>
            <Button onClick={addNewSection} className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Add Custom Section
            </Button>
          </div>
          <div className="space-y-6">
            {sections.map(section => (
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