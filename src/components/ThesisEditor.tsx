import React, { useState } from 'react';
import { ThesisSidebar } from './ThesisSidebar';
import { EditorSection } from './EditorSection';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export interface Section {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'abstract' | 'introduction' | 'methodology' | 'results' | 'discussion' | 'conclusion' | 'custom';
}

export const ThesisEditor = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Thesis Title',
      content: 'Enter your thesis title...',
      type: 'title'
    },
    {
      id: '2',
      title: 'Abstract',
      content: 'Summarize your research...',
      type: 'abstract'
    },
    {
      id: '3',
      title: 'Introduction',
      content: 'Introduce your research topic...',
      type: 'introduction'
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
      type: 'custom'
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
              Add Section
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